const News = require("../models/news");

const getAllNews = async (req, res) => {
    try {
        const news = await News.getAllNews();
        res.json(news);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving news");
    }
};

const getNewsById = async (req, res) => {
   
    const newsId = req.params.newsId;
  
    try {
        const news = await News.getNewsById(newsId);
        if (!news) {
            return res.status(404).send("News not found");
        }
        res.json(news);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error retrieving news");
    }
};



const createNews = async (req, res) => {
    const newNews = req.body;
   
    console.log(newNews);
    try {
        const createdNews = await News.createNews(newNews);
        res.status(201).json(createdNews);
    } catch (error) {
        
        res.status(500).send('Error creating news');
    }
};

const updateNews = async (req, res) => {
    const newsId = parseInt(req.params.newsId);
    const newNewsData = req.body;
    try {
        const updatedNews = await News.updateNews(newsId, newNewsData);
        if (!updateNews) {
            return res.status(500).send("News not found");
        }
        res.json(updateNews);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating news");
    }
}

const deleteNews = async (req, res) => {
    const newsId = parseInt(req.params.newsId);
    try {
        const success = await News.deleteNews(newsId);
        if (!success) {
            return res.status(500).send("News not found")
        }
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting news");
    }
};

module.exports = {
    getAllNews, 
    getNewsById,
    createNews,
    deleteNews,
    updateNews,
};