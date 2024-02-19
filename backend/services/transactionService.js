const axios = require('axios');
const Transaction = require('../models/transactionModel');

exports.initializeDatabase = async () => {




  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const data = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(data);

    return { message: 'Database initialized successfully' };
  } catch (error) {
    throw new Error('Error initializing database');
  }
};

exports.listTransactions = async (month, search, page) => {

  

  try {
    let query = {};
    const regex = new RegExp(search, 'i');

    query.$or = [
      { title: { $regex: regex } },
      { description: { $regex: regex } },
    ];

    
    

    const numericSearch = parseFloat(search);
    if (!isNaN(numericSearch)) {
      query.$or.push({ price: { $gte: numericSearch, $lt: numericSearch + 1 } });
    }


    

    if (month) {
      const paddedMonth = month.padStart(2, '0');
      query.dateOfSale = { $regex: new RegExp(`\\b${paddedMonth}\\b`, 'i') };
    }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * 10)
      .limit(10);

    return transactions;
  } catch (error) {
    console.error('Error in listTransactions service:', error);
    throw new Error('Error fetching transactions');
  }
};

exports.getStatistics = async (month) => {
  try {

    
    const paddedMonth = month.padStart(2, '0');


    
    const totalSaleAmount = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $regex: new RegExp(`\\b${paddedMonth}\\b`, 'i') },
        },
      },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);


    
    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: new RegExp(`\\b${paddedMonth}\\b`, 'i') },
      sold: true,
    });


    
    const totalUnsoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: new RegExp(`\\b${paddedMonth}\\b`, 'i') },
      sold: false,
    });

    return {
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalUnsoldItems,
    };
  } catch (error) {
    console.error('Error in getStatistics service:', error);
    throw new Error('Error fetching statistics');
  }
};

exports.getBarChartDataByMonth = async (month) => {
  try {

    
    const paddedMonth = month.padStart(2, '0');


    
    const barChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $regex: new RegExp(`\\b${paddedMonth}\\b`, 'i') },
        },
      },
      {
        $group: {
          _id: null,
          range0to100: { $sum: { $cond: [{ $lte: ['$price', 100] }, 1, 0] } },
          range101to200: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 100] }, { $lte: ['$price', 200] }] }, 1, 0] } },
          range201to300: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 200] }, { $lte: ['$price', 300] }] }, 1, 0] } },
          range301to400: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 300] }, { $lte: ['$price', 400] }] }, 1, 0] } },
          range401to500: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 400] }, { $lte: ['$price', 500] }] }, 1, 0] } },
          range501to600: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 500] }, { $lte: ['$price', 600] }] }, 1, 0] } },
          range601to700: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 600] }, { $lte: ['$price', 700] }] }, 1, 0] } },
          range701to800: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 700] }, { $lte: ['$price', 800] }] }, 1, 0] } },
          range801to900: { $sum: { $cond: [{ $and: [{ $gt: ['$price', 800] }, { $lte: ['$price', 900] }] }, 1, 0] } },
          range901above: { $sum: { $cond: [{ $gt: ['$price', 900] }, 1, 0] } },
        },
      },
    ]);



    const counts = {
      '0-100': barChartData[0]?.range0to100 || 0,
      '101-200': barChartData[0]?.range101to200 || 0,
      '201-300': barChartData[0]?.range201to300 || 0,
      '301-400': barChartData[0]?.range301to400 || 0,
      '401-500': barChartData[0]?.range401to500 || 0,
      '501-600': barChartData[0]?.range501to600 || 0,
      '601-700': barChartData[0]?.range601to700 || 0,
      '701-800': barChartData[0]?.range701to800 || 0,
      '801-900': barChartData[0]?.range801to900 || 0,
      '901-above': barChartData[0]?.range901above || 0,
    };

    return counts;
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    throw new Error('Internal Server Error');
  }
};


exports.getPieChartDataByMonth = async (month) => {
  try {

    
    const paddedMonth = month.padStart(2, '0');

    
    

    const pieChartData = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $regex: new RegExp(`\\b${paddedMonth}\\b`, 'i') },
        },
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    



    
    const formattedChartData = pieChartData.reduce((result, data) => {
      result[data._id] = data.count;
      return result;
    }, {});

    return formattedChartData;
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    throw new Error('Internal Server Error');
  }
};