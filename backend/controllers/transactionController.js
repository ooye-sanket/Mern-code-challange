const transactionService = require('../services/transactionService');

exports.initializeDatabase = async (req, res) => {
    try {
        const result = await transactionService.initializeDatabase();
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });


    }
};

exports.listTransactions = async (req, res) => {



    try {
        const { month, search = '', page = 1 } = req.query;


        const transactions = await transactionService.listTransactions(month, search, page);

        res.status(200).json({ transactions });
    } catch(error) {

        console.error('Error in listTransactions controller:', error);
        
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const { month } = req.query;
  
       
        const monthIndex = parseInt(month);
        if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
            return res.status(400).json({ error: 'Invalid month parameter' });
        }
  
   
        const statistics = await transactionService.getStatistics(month);
    
        res.status(200).json(statistics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;
  

        const monthIndex = parseInt(month);
        if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
            return res.status(400).json({ error: 'Invalid month parameter' });
        }
  

        const barChartData = await transactionService.getBarChartDataByMonth(month);
    
        res.status(200).json(barChartData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;
          const monthIndex = parseInt(month);
        if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
            return res.status(400).json({ error: 'Invalid month parameter' });
        }
  
 
        const pieChartData = await transactionService.getPieChartDataByMonth(month);
    
        res.status(200).json(pieChartData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;


        const monthIndex = parseInt(month);
        if (isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
            return res.status(400).json({ error: 'Invalid month parameter' });
        }

        const statisticsData = await transactionService.getStatistics(month);





        const barChartData = await transactionService.getBarChartDataByMonth(month);






        const pieChartData = await transactionService.getPieChartDataByMonth(month);

        // Combine the responses
        const combinedData = {
            statisticsData,
            barChartData,
            pieChartData,
        };

        res.status(200).json(combinedData);
    } catch (error) {
        console.error(error);










        res.status(500).json({ error: 'Internal Server Error' });
    }
};