// Simple test function to verify Vercel is detecting functions
module.exports = async (req, res) => {
    res.status(200).json({ 
        message: 'Test function works!',
        path: req.url,
        method: req.method
    });
};

