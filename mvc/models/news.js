//News model contains crud operations to manipulate newspost data

const sql =  require("mssql");
const dbConfig = require("../../dbConfig");
const { request } = require("express");

class News {
    constructor(newsId, newsImage, newsDesc, newsSource, newsContent, newsUrl, newsDate) {
        this.newsId = newsId;
        this.newsImage = newsImage;
        this.newsDesc = newsDesc;
        this.newsSource = newsSource;
        this.newsContent = newsContent;
        this.newsUrl = newsUrl;
        this.newsDate = newsDate;
    }
    
    //Gets all newspost data ordered by newest data first
    static async getAllNews() {
        const connection = await sql.connect(dbConfig);
       
        const sqlQuery = `SELECT * FROM NewsPost ORDER BY NewsDate DESC`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new News(row.NewsID, row.NewsImage, row.NewsDesc, row.NewsSource));
    }

    //Gets newspost data by its newsId
    static async getNewsById(newsId) {
        const connection = await sql.connect(dbConfig);
     
        const sqlQuery = `SELECT * FROM NewsPost WHERE NewsID = @newsId`;

        const request = connection.request();
        request.input("newsId", newsId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new News(row.NewsID, row.NewsImage, row.NewsDesc, row.NewsSource, row.NewsContent, row.NewsUrl, row.NewsDate));
    }

    
    //Creates a newspost 
    static async createNews(newNewsData) {
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `INSERT INTO NewsPost (NewsID, NewsImage, NewsDesc, NewsSource, NewsContent, NewsDate, NewsUrl) VALUES (@newsId, @newsImage, @newsDesc, @newsSource, @newsContent, @newsDate, @newsUrl);`;

        const request = connection.request();
        request.input("newsId", newNewsData.newsId);
        request.input("newsImage", newNewsData.newsImage);
        request.input("newsDesc", newNewsData.newsDesc);
        request.input("newsSource", newNewsData.newsSource);
        request.input("newsDate", newNewsData.newsDate);
        request.input("newsContent", newNewsData.newsContent);
        request.input("newsUrl", newNewsData.newsUrl);
        const result = await request.query(sqlQuery);

        connection.close();
    }


}

module.exports = News;