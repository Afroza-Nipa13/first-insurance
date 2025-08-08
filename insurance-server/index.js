const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');



const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// 'http://localhost:5173'
// 'https://last-assignment-project.web.app',
// middleware

app.use(cors({
  origin: 'https://last-assignment-project.web.app',
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});








async function run() {
  try {
    const db = client.db('insuranceDB'); // database name
    const policiesCollection = db.collection('policies');
    const customersCollection = db.collection('customers');
    const applicationsCollection = db.collection('applications');
    const paymentsCollection = db.collection('payments')
    const reviewsCollection = db.collection('reviews');
    const blogsCollection = db.collection('blogs')
    const claimsCollection = db.collection('claims');
    const agentsCollection = db.collection('agents')


    const verifyToken = async (req, res, next) => {
      const token = req.cookies?.token

      if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err)
          return res.status(401).send({ message: 'unauthorized access' })
        }
        req.user = decoded
        next()
      })
    }

    const verifyAgent = async (req, res, next) => {
      const email = req?.user?.email
      const user = await customersCollection.findOne({
        email,
      })
      console.log(user?.role)
      if (!user || user?.role !== 'agent')
        return res
          .status(403)
          .send({ message: 'Agent only Actions!', role: user?.role })

      next()
    }
    const verifyCustomer = async (req, res, next) => {
      const email = req?.user?.email
      const user = await customersCollection.findOne({
        email,
      })
      console.log(user?.role)
      if (!user || user?.role !== 'customer')
        return res
          .status(403)
          .send({ message: 'customer only Actions!', role: user?.role })

      next()
    }
    const verifyAdmin = async (req, res, next) => {
      const email = req?.user?.email
      const user = await customersCollection.findOne({
        email,
      })
      console.log(user?.role)
      if (!user || user?.role !== 'admin')
        return res
          .status(403)
          .send({ message: 'Admin only Actions!', role: user?.role })

      next()
    }


    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const { email } = req.body; // ✅ destructuring
      if (!email) {
        return res.status(400).send({ message: 'Email is required' });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '365d',
      });

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true });
    });
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res.clearCookie('token', {
          maxAge: 0,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    })


    // getting customer role

    app.get('/users/role/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email)
      const user = await customersCollection.findOne({ email });

      if (!user) {
        return res.status(404).send({ role: null });
      }

      res.send({ role: user.role });
    });

    // PATCH /users/:email
    app.patch('/users/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const updateDoc = {
        $set: {
          photoURL: req.body.photoURL,
          displayName: req.body.displayName
        }
      };

      const result = await customersCollection.updateOne({ email }, updateDoc);
      res.send({ success: result.modifiedCount > 0 });
    });


    // admin api
    app.get('/users', verifyToken, async (req, res) => {
      const role = req.query.role;
      let query = {};
      if (role) query.role = role;

      const result = await customersCollection.find(query).toArray();
      res.send(result);
    });

    // Promote to agent
    app.patch('/users/:id/promote', verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await customersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role: 'agent' } }
      );
      res.send({ success: true });
    });

    // demote to customer
    app.patch('/users/:id/demote', verifyToken, async (req, res) => {
      const id = req.params.id;
      const result = await customersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role: 'customer' } }
      )
      res.send({ success: true })
    })


    // DELETE /users/:id
    app.delete('/users/:id', verifyToken, async (req, res) => {
      const id = req.params.id;

      try {
        const result = await customersCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result); // will contain deletedCount
      } catch (error) {
        res.status(500).send({ error: 'Failed to delete user' });
      }
    });


    // POST request to save agent request
    app.post('/agent-requests', verifyToken, async (req, res) => {
      const agent = req.body;

      // Optional: Prevent duplicate requests
      const existing = await agentsCollection.findOne({ email: agent.email });
      if (existing) {
        return res.status(400).send({ message: 'You already submitted a request.' });
      }

      const result = await agentsCollection.insertOne(agent);
      res.send(result);
    });



    // saving assigned agent
    // PATCH /applications/:id/assign-agent

    app.patch('/applications/:id/assign-agent', async (req, res) => {
      const applicationId = req.params.id;
      const { status, agentId, agentName, agentEmail } = req.body;

      if (!status || !agentId || !agentEmail) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      try {
        const result = await applicationsCollection.updateOne(
          { _id: new ObjectId(applicationId) },
          {
            $set: {
              status,
              agentId,
              agentName,
              agentEmail,
              updatedAt: new Date() // Optional: Update time of assignment
            }
          }
        );

        res.send({ modifiedCount: result.modifiedCount });
      } catch (error) {
        console.error('Error assigning agent:', error);
        res.status(500).json({ message: 'Failed to assign agent' });
      }
    });



    // get customers for assigned customer page as an agent
    app.get('/agent-applications', verifyToken, async (req, res) => {
      const email = req.query.email;

      try {
        const applications = await applicationsCollection
          .find({ agentEmail: email, status: "Assigned" }) // Only assigned applications
          .toArray();

        const enrichedApplications = await Promise.all(applications.map(async (app) => {
          const policy = await policiesCollection.findOne({ _id: new ObjectId(app.policyId) });
          return {
            ...app,
            policy,
          };
        }));

        res.send(enrichedApplications);
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to get applications' });
      }
    });



    // get customers from register page 
    app.post('/customers', async (req, res) => {
      const email = req.body.email;
      const customerExists = await customersCollection.findOne({ email })
      if (customerExists) {
        return res.status(200).send({ message: "customer already exist", inserted: false })
      }

      const customer = req.body;
      const result = await customersCollection.insertOne(customer)
      res.send(result)
    })

    // //get customers role by email

    // app.get('/customers/:email/role', async (req, res) => {
    //   try {
    //     const email = req.params.email;

    //     if (!email) {
    //       return res.status(400).send({ message: 'Email is required' });
    //     }

    //     const user = await customersCollection.findOne({ email });

    //     if (!user) {
    //       return res.status(404).send({ message: 'Customer not found' });
    //     }

    //     res.send({ role: user.role || 'customer' });
    //   } catch (error) {
    //     console.error('Error getting customer role:', error);
    //     res.status(500).send({ message: 'Failed to get role' });
    //   }
    // });



    // get most purchased policy data
    app.get('/popular-policies', async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 6;
        const sort = { purchaseCount: -1 }
        const result = await policiesCollection.find().sort(sort).limit(limit).toArray()
        res.send(result)
      }
      catch (error) {
        console.error('❌ Failed to fetch policies:', error);
        res.status(500).json({ error: 'Failed to load policies' });
      }
    })


    // GET all policies
    app.get('/all-policies', async (req, res) => {
      try {
        const category = req.query.category;
        const page = parseInt(req.query.page) || 1;      // Default page 1
        const limit = parseInt(req.query.limit) || 6;    // Default 6 per page

        const filter = {};
        if (category) {
          filter.category = category;
        }

        const skip = (page - 1) * limit;

        const cursor = policiesCollection.find(filter)
          .skip(skip)
          .limit(limit);

        const policies = await cursor.toArray();

        const totalCount = await policiesCollection.countDocuments(filter);

        res.send({
          policies,
          totalCount
        });
      } catch (error) {
        console.error('❌ Failed to fetch policies:', error);
        res.status(500).json({ error: 'Failed to load policies' });
      }
    });

    // agents api
    app.patch('/applications/:id', verifyToken, verifyAgent, async (req, res) => {
      const appId = req.params.id;
      const { status, policyId } = req.body;

      if (status === 'Approved' && !policyId) {
        return res.status(400).send({ success: false, message: 'Policy ID required for approval' });
      }


      try {
        const result = await applicationsCollection.updateOne(
          { _id: new ObjectId(appId) },
          { $set: { status } }
        );

        if (status === 'Approved' && policyId) {
          await policiesCollection.updateOne(
            { _id: new ObjectId(policyId) },
            { $inc: { purchaseCount: 1 } }
          );
        }

        res.send({ success: true, message: 'Application status updated' });
      } catch (err) {
        console.error('❌ Failed to update:', err);
        res.status(500).send({ success: false, message: 'Server error' });
      }
    });



    // feedback as admin
    app.patch('/applications/:id/feedback', verifyToken, verifyAdmin, async (req, res) => {
      const applicationId = req.params.id;
      const { feedback, status } = req.body;

      // Validation
      if (!feedback?.trim() || !status?.trim()) {
        return res.status(400).send({
          success: false,
          message: 'Feedback and status are required'
        });
      }

      try {
        const result = await applicationsCollection.updateOne(
          { _id: new ObjectId(applicationId) },
          {
            $set: {
              rejectionFeedback: feedback.trim(),
              status: status.trim(),
              updatedAt: new Date() // ✅ Good practice to track updates
            }
          }
        );

        if (result.modifiedCount > 0) {
          res.send({
            success: true,
            message: 'Feedback and status updated successfully',
            updatedFields: ['rejectionFeedback', 'status']
          });
        } else {
          res.status(404).send({
            success: false,
            message: 'Application not found or no changes made'
          });
        }
      } catch (error) {
        console.error('❌ Failed to update application:', error);
        res.status(500).send({
          success: false,
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });



    // get all policies by id

    app.get('/all-policies/:id', async (req, res) => {
      try {
        const id = req.params.id;

        // Check if the ID is a valid ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: 'Invalid policy ID' });
        }

        const query = { _id: new ObjectId(id) };
        const policy = await policiesCollection.findOne(query);

        if (!policy) {
          return res.status(404).send({ error: 'Policy not found' });
        }

        res.send(policy);
      } catch (error) {
        console.error('❌ Failed to fetch policy by ID:', error);
        res.status(500).send({ error: 'Server error while fetching policy' });
      }
    });

    app.patch('/all-policies/:id', async (req, res) => {
      const policyId = req.params.id;
      const updatedPolicy = req.body;

      try {
        const filter = { _id: new ObjectId(policyId) };

        const updateDoc = {
          $set: {
            title: updatedPolicy.title,
            category: updatedPolicy.category,
            description: updatedPolicy.description,
            image: updatedPolicy.image,
            minAge: parseInt(updatedPolicy.minAge),
            maxAge: parseInt(updatedPolicy.maxAge),
            coverageRange: {
              min: parseInt(updatedPolicy.coverageRange?.min || 0),
              max: parseInt(updatedPolicy.coverageRange?.max || 0),
            },
            durationOptions: updatedPolicy.durationOptions || [],
            basePremiumRate: parseFloat(updatedPolicy.basePremiumRate),
            updatedAt: new Date(),
          },
        };

        const result = await policiesCollection.updateOne(filter, updateDoc);

        res.send({ success: true, modifiedCount: result.modifiedCount });
      } catch (err) {
        console.error('❌ Failed to update policy:', err);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });


    app.post('/all-policies', async (req, res) => {
      const newPolicy = req.body;
      const result = await policiesCollection.insertOne(newPolicy);
      res.send(result);
    });


    app.delete('/all-policies/:id', async (req, res) => {
      const id = req.params.id;

      try {
        const result = await policiesCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result); // will contain deletedCount
      } catch (error) {
        res.status(500).send({ error: 'Failed to delete policy' });
      }
    });




    app.get('/policy-categories', async (req, res) => {
      try {
        // Get unique categories from your collection
        const categoriesData = await policiesCollection.aggregate([
          { $group: { _id: "$category" } }
        ]).toArray();

        const categories = categoriesData.map(cat => cat._id);


        res.send(categories); // e.g. ["Term Life", "Senior Plan", "Other"]
      } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
        res.status(500).json({ error: 'Failed to load categories' });
      }
    });
    // Post: quote by id
    app.get('/applications', verifyToken, async (req, res) => {
      try {
        const email = req.query.email;
        const status = req.query.status;
        const query = {}

        if (email) {
          query['user.email'] = email;
        }
        if (status) {
          query['status'] = status;
        }


        // Step 1: Find applications

        const applications = await applicationsCollection.find(query).toArray();

        // Step 2: Map and attach policy info to each application
        const result = await Promise.all(applications.map(async (app) => {
          let policy = null;

          // Try fetching policy if policyId exists
          if (app.policyId) {
            try {
              const policyObjectId = typeof app.policyId === 'string' ? new ObjectId(app.policyId) : app.policyId;
              policy = await policiesCollection.findOne({ _id: policyObjectId });
            } catch (e) {
              console.warn(`Invalid policyId for application ${app._id}: ${app.policyId}`);
            }
          }

          return {
            ...app,
            policy, // attach full policy object here
          };
        }));

        res.send(result);
      } catch (err) {
        console.error('❌ Failed to fetch applications:', err);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });

    // delete from application list
    // app.delete('/applications/:id', async (req, res) => {
    //   const { id } = req.params;

    //   try {
    //     const result = await applicationsCollection.deleteOne(
    //       { _id: new ObjectId(id) }    );

    //     if (result.deletedCount > 0) {
    //       res.send({ success: true, message: 'Application deleted successfully' });
    //     } else {
    //       res.status(404).send({ success: false, message: 'Application not found or already rejected' });
    //     }
    //   } catch (error) {
    //     console.error('Error rejecting application:', error);
    //     res.status(500).send({ success: false, message: 'Internal server error' });
    //   }
    // });

    // PATCH /applications/:id/reject
    app.patch('/applications/:id/reject', verifyToken, verifyAdmin, async (req, res) => {
      const { id } = req.params;
      console.log(id)

      try {
        const result = await applicationsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: 'Rejected' } }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: 'Application rejected successfully' });
        } else {
          res.status(404).send({ success: false, message: 'Application not found or already rejected' });
        }
      } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
      }
    });



    // Applications api
    app.get('/applications', verifyToken, async (req, res) => {
      try {
        const email = req.query.email;

        // for "My Policies")
        if (email) {
          const result = await applicationsCollection.find({ "user.email": email }).toArray();
          return res.send(result);
        }

        // (for admin view)
        const applications = await applicationsCollection.aggregate([
          {
            $addFields: {
              policyId: {
                $cond: {
                  if: { $eq: [{ $type: "$policyId" }, "string"] },
                  then: { $toObjectId: "$policyId" },
                  else: "$policyId"
                }
              }
            }
          },
          {
            $lookup: {
              from: 'policies',
              localField: 'policyId',
              foreignField: '_id',
              as: 'policyInfo'
            }
          },
          {
            $unwind: {
              path: '$policyInfo',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              user: 1,
              status: 1,
              createdAt: 1,
              policy: '$policyInfo'
            }
          }
        ]).toArray();

        res.send(applications);
      } catch (err) {
        console.error('❌ Failed to fetch applications:', err);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });


    // GET /applications/approved?agentEmail=anisur@rahman.com

    app.get('/applications/approved', async (req, res) => {
      try {
        const { agentEmail } = req.query;

        if (!agentEmail) {
          return res.status(400).json({ message: 'agentEmail is required' });
        }

        const approvedApplications = await applicationsCollection
          .find({ status: 'Approved', agentEmail })
          .project({
            'user.name': 1,
            status: 1,
            updatedAt: 1,
          })
          .toArray();

        res.send(approvedApplications);
      } catch (error) {
        console.error('Error fetching approved customers:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });


    app.post('/applications', verifyToken, async (req, res) => {
      const application = req.body;
      const newApplication = {
        ...application,
        policyId: new ObjectId(application.policyId), // ✅ ensure this is sent from frontend
        status: 'Pending',
        createdAt: new Date()
      };
      const result = await applicationsCollection.insertOne(newApplication);
      res.send(result);
    });

    // update payment status paid

    app.patch('/applications/:id/mark-paid', verifyToken, async (req, res) => {
      const { id } = req.params;

      try {
        const result = await applicationsCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              'premium.status': 'paid',
              status: "Active",
              updatedAt: new Date()
            }
          }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: 'Payment status updated to paid.' });
        } else {
          res.status(404).send({ success: false, message: 'Application not found or already paid.' });
        }
      } catch (error) {
        console.error('❌ Failed to update payment status:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
      }
    });



    // reviews api
    app.get('/reviews', async (req, res) => {
      try {
        const result = await reviewsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });


    app.post('/reviews', verifyToken, async (req, res) => {
      try {
        const review = req.body;

        // Optional: validate fields (rating, feedback, policyId, etc.)
        if (!review.policyId || !review.rating || !review.feedback) {
          return res.status(400).send({ error: 'Invalid review data' });
        }

        review.createdAt = new Date();

        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      } catch (error) {
        console.error('❌ Failed to submit review:', error);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });


    // get customer payment status

    app.get('/payment-status', verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { "user.email": email };

      const applications = await applicationsCollection.find(query).toArray();
      res.send(applications);
    });

    app.post('/payment-intent', verifyToken, async (req, res) => {
      try {
        const { amount } = req.body;
        console.log(amount)

        if (!amount || typeof amount !== 'number') {
          return res.status(400).send({ error: '❌ Invalid or missing amount' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Stripe takes amount in smallest currency unit
          currency: 'bdt',
          payment_method_types: ['card'],
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });

      } catch (error) {
        console.error('❌ Stripe Payment Intent Error:', error);
        res.status(500).send({ error: 'Internal server error' });
      }
    });

    // payment collection api


    // GET all payments
    app.get('/payments', verifyToken, async (req, res) => {
      try {
        const { email, policy, fromDate, toDate } = req.query;
        const query = {}
        if (email) query.email = email;
        if (policy) query.policyTitle = policy;
        if (fromDate || toDate) {
          query.date = {};
          if (fromDate) query.date.$gte = new Date(fromDate);
          if (toDate) query.date.$lte = new Date(toDate);
        }
        const payments = await paymentsCollection.find(query).toArray();
        res.send(payments);
        // console.log("payments from payment get api",payments)

      } catch (error) {
        console.error("❌ Failed to get payments:", error);
        res.status(500).send({ error: 'Failed to fetch payments' });
      }
    });


    // Get total income 

    app.get('/total-income', verifyToken, verifyAdmin, async (req, res) => {
      try {
        const payments = await paymentsCollection.find().toArray();
        // console.log(payments)
        const totalIncome = payments.reduce((sum, item) => sum + Number(item.amount), 0);
        // console.log('total income',totalIncome)
        res.send({ totalIncome });
      } catch (error) {
        res.status(500).send({ error: 'Failed to calculate income' });
      }
    });


    // GET income by email
    app.get('/admin-income', verifyToken,verifyAdmin, async (req, res) => {
      try {
        

        const userPayments = await paymentsCollection
          .find({  status: 'success' }) // ✅ filter by success status
          .toArray();

        const totalIncome = userPayments.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );
        console.log(totalIncome)

        res.send({ totalIncome });
      } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Failed to calculate user income' });
      }
    });



    // POST payments
    app.post('/payments', verifyToken, async (req, res) => {
      try {
        const paymentData = req.body;

        const result = await paymentsCollection.insertOne(paymentData);

        res.send({ success: true, insertedId: result.insertedId });
      } catch (error) {
        console.error("❌ Failed to save payment:", error);
        res.status(500).send({ error: 'Failed to save payment' });
      }
    });






    // posting all claims here

    app.get('/claims', verifyToken, async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ error: 'Missing email' });

      const claims = await db.collection('claims').find({ userEmail: email }).toArray();
      res.send(claims);
    });


    app.post('/claims', verifyToken, async (req, res) => {
      try {
        const { policyId, userEmail, reason, document, submittedAt } = req.body;

        // Basic validation
        if (!policyId || !userEmail || !reason) {
          return res.status(400).json({ error: '❌ Missing required fields (policyId, userEmail, reason)' });
        }

        const claim = {
          policyId: new ObjectId(policyId),
          userEmail,
          reason,
          document: document || null, // optional
          status: 'Pending',
          submittedAt: submittedAt ? new Date(submittedAt) : new Date()
        };

        const result = await claimsCollection.insertOne(claim);

        res.status(201).json({
          message: '✅ Claim submitted successfully',
          insertedId: result.insertedId
        });

      } catch (error) {
        console.error('❌ Error submitting claim:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // newsletter post api

    app.post('/subscribe', async (req, res) => {
      try {
        const { name, email, message } = req.body;
        const result = await db.collection('subscribers').insertOne({
          name,
          email,
          message,
          subscribedAt: new Date()
        });
        res.send(result);
      } catch (err) {
        console.error('Failed to save subscription:', err);
        res.status(500).send({ error: 'Subscription failed' });
      }
    });
    // meet our agents get api

    // GET: /featured-agents
    app.get('/get-agents', async (req, res) => {
      try {
        const agents = await customersCollection
          .find({ role: 'agent' })
          .sort({ createdAt: -1 }) // optional: latest agent first
          .limit(3)
          .toArray();
        res.send(agents);
      } catch (err) {
        res.status(500).send({ error: 'Failed to fetch agents' });
      }
    });




    // latest blogs get api

    app.get('/latest-blogs', async (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 4;
        const sort = { publishDate: -1 }
        const result = await blogsCollection.find().sort(sort).limit(limit).toArray()
        res.send(result)
      }
      catch (error) {
        console.error('❌ Failed to fetch latest blogs:', error);
        res.status(500).json({ error: 'Failed to load latest blogs' });
      }
    })


    app.get('/blogs', async (req, res) => {
      const email = req.query.email;

      try {
        if (email) {
          const result = await blogsCollection.find({ email }).toArray();
          return res.send(result);
        }

        const result = await blogsCollection.find().sort({ publishDate: -1 }).toArray();
        res.send(result);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        res.status(500).send({ error: 'Internal Server Error' });
      }
    });


    // get single blog by id

    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const objectId = { _id: new ObjectId(id) }

      try {
        const blog = await blogsCollection.findOne(objectId);

        if (!blog) {
          return res.status(404).send({ error: '❌ Blog not found' });
        }

        res.send(blog);
      } catch (error) {
        console.error("❌ Failed to get blog by ID:", error);
        res.status(500).send({ error: 'Internal server error' });
      }
    });

    //save all blogs

    app.post('/blogs', verifyToken, async (req, res) => {
      try {
        const blog = req.body;


        if (
          !blog.title ||
          !blog.content ||
          !blog.publishDate ||
          !blog.author ||
          !blog.email ||
          !blog.image ||
          blog.visitCount === undefined // only check existence
        ) {
          return res.status(400).send({ message: 'All fields are required' });
        }
        blog.createdAt = new Date();

        const result = await blogsCollection.insertOne(blog);

        res.status(201).send({
          success: true,
          insertedId: result.insertedId,
          message: 'Blog added successfully'
        });
      } catch (error) {
        console.error('❌ Failed to add blog:', error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    app.patch('/blogs/:id/visit', async (req, res) => {
      const blogId = req.params.id;
      const docId = { _id: new ObjectId(blogId) }
      const docIncrement = { $inc: { visitCount: 1 } }
      const result = await blogsCollection.updateOne(docId, docIncrement);
      res.send(result);
    });


    app.delete('/blogs/:id', verifyToken, async (req, res) => {
      const blogId = req.params.id;
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
      res.send(result);
    });




    // saved editing blog
    app.patch('/blogs/:id', verifyToken, async (req, res) => {
      try {
        const blogId = req.params.id;
        const updatedData = req.body;
        const filter = { _id: new ObjectId(blogId) }
        const updatedDoc = {
          $set: {
            title: updatedData.title,
            image: updatedData.image,
            content: updatedData.content,
            author: updatedData.author,
            email: updatedData.email,
            publishDate: updatedData.publishDate,
            visitCount: updatedData.visitCount

          }
        }
        const result = await blogsCollection.updateOne(filter, updatedDoc)

        res.send({
          success: true,
          modifiedCount: result.modifiedCount,
          message: result.modifiedCount
            ? 'Blog updated successfully'
            : 'No changes made',
        });

      }
      catch (error) {
        console.error('Failed to update blog:', error);
        res.status(500).send({ error: 'Internal Server Error' });
      }

    })


    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// Start Server After DB Connect

app.get('/', (req, res) => {
  res.send('First insurance server is running...')
})

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

