import { useForm } from 'react-hook-form';
import { Link, Navigate, useParams } from 'react-router';
import { useState } from 'react';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

const QuotePage = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [estimate, setEstimate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: policy, isLoading } = useQuery({
    queryKey: ['policy', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-policies/${id}`);
      return res.data;
    },
  });

  const getRiskMultiplier = (age, gender, smoker) => {
    let multiplier = 1;

    if (age >= 18 && age <= 30) multiplier *= 1.0;
    else if (age <= 45) multiplier *= 3.2;
    else if (age <= 60) multiplier *= 3.5;
    else multiplier *= 2.0;

    if (gender === 'male') multiplier *= 2.1;
    if (smoker === 'yes') multiplier *= 3.5;

    return multiplier;
  };

  const CalculatePremium = (age, gender, smoker, coverageAmount, baseRate) => {
    const multiplier = getRiskMultiplier(age, gender, smoker);
    const annual = (coverageAmount / 1000) * baseRate * multiplier;
    const monthly = annual / 12;
    return {
      annual: Math.round(annual),
      monthly: Math.round(monthly),
    };
  };

  const onSubmit = (data) => {
    const age = parseInt(data.age);
    const gender = data.gender;
    const smoker = data.smoker;
    const frequency = data.frequency;
    const coverageAmount = parseFloat(data.coverageAmount);
    const baseRate = policy?.basePremiumRate || 0.03;

    const result = CalculatePremium(age, gender, smoker, coverageAmount, baseRate);
    const amount = frequency === 'yearly' ? result.annual : result.monthly;

    const quoteInfo = {
      age,
      gender,
      smoker,
      coverageAmount,
      frequency,
      premium: {
        amount,
        frequency,
        status: 'due',
      },
    };

    setEstimate(quoteInfo);
  };

  if (!policy && !isLoading) {
    return <Navigate to="/all-policies" />;
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl mx-auto mt-30 rounded-2xl p-6 shadow-xl bg-white mb-10">
      <Helmet>
        <title>Quote Page | FIRST Life Insurance</title>
      </Helmet>

      <h2 className="text-4xl text-center divider font-bold mb-10">Get Your Quote</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Age Field */}
        <div>
          <p className="font-medium">Your Age *</p>
          <input
            {...register('age', {
              required: 'Age is required',
              min: {
                value: policy?.minAge || 18,
                message: `Minimum age is ${policy?.minAge}`,
              },
              max: {
                value: policy?.maxAge || 65,
                message: `Maximum age is ${policy?.maxAge}`,
              },
            })}
            type="number"
            placeholder={`Enter your age (${policy?.minAge} - ${policy?.maxAge})`}
            className="input input-bordered w-full"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        {/* Gender Select */}
        <div>
          <p className="font-medium">Select Your Gender *</p>
          <select {...register('gender', { required: 'Gender is required' })} className="select select-bordered w-full">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>

        {/* Coverage Amount */}
        <div>
          <p className="font-medium">Coverage Amount *</p>
          <input
            {...register('coverageAmount', {
              required: 'Coverage Amount is required',
              min: {
                value: 200000,
                message: 'Minimum coverage is 2,00,000',
              },
            })}
            placeholder="e.g. 200000"
            type="number"
            className="input input-bordered w-full"
          />
          {errors.coverageAmount && <p className="text-red-500 text-sm">{errors.coverageAmount.message}</p>}
        </div>

        {/* Duration */}
        <div>
          <p className="font-medium">Duration *</p>
          <select {...register('duration', { required: 'Duration is required' })} className="select select-bordered w-full">
            <option value="">Select Duration</option>
            {policy?.durationOptions?.map((option, i) => (
              <option key={i} value={option}>{option} Years</option>
            ))}
          </select>
          {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
        </div>

        {/* Smoker Radio */}
        <div>
          <p className="font-medium">Do You Smoke? *</p>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                {...register('smoker', { required: 'Please select your smoking status' })}
                className="radio radio-sm"
              />
              <span>Smoker</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register('smoker', { required: 'Please select your smoking status' })}
                className="radio radio-sm"
              />
              <span>Non-Smoker</span>
            </label>
          </div>
          {errors.smoker && <p className="text-red-500 text-sm">{errors.smoker.message}</p>}
        </div>

        {/* Frequency Radio */}
        <div>
          <p className="font-medium">Payment Frequency *</p>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="monthly"
                {...register('frequency', { required: 'Please select payment frequency' })}
                className="radio radio-sm"
              />
              <span>Monthly</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yearly"
                {...register('frequency', { required: 'Please select payment frequency' })}
                className="radio radio-sm"
              />
              <span>Yearly</span>
            </label>
          </div>
          {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency.message}</p>}
        </div>

        <button type="submit" className="btn btn-primary w-full">Estimate</button>
      </form>

      {/* Quote Result */}
      {estimate && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p><strong>Monthly Premium:</strong> ৳{CalculatePremium(estimate.age, estimate.gender, estimate.smoker, estimate.coverageAmount, policy?.basePremiumRate || 0.03).monthly}</p>
          <p><strong>Annual Premium:</strong> ৳{CalculatePremium(estimate.age, estimate.gender, estimate.smoker, estimate.coverageAmount, policy?.basePremiumRate || 0.03).annual}</p>
          <p><strong>Selected:</strong> {estimate.frequency} | ৳{estimate.premium.amount}</p>
          <Link to={`/application-form/${id}`} state={estimate}>
            <button className="btn btn-success mt-4">Apply for Policy</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuotePage;


