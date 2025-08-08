export const aggregatePaymentsByDate=(payments)=>{

    const earningByDate= {}
    payments.forEach((payment)=>{
        if(payment.status === 'success'){
            const date = new Date(payment.date).toISOString().split('T')[0]
            earningByDate[date]= (earningByDate[date] || 0) + payment.amount;
        }
    })
    return Object.entries(earningByDate).map(([date,total])=>({
        date,
        total                                                                       
    }))
}