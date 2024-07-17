//Note id is equivalent to name

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

    static async getAllNews() {
        const connection = await sql.connect(dbConfig);
       
        const sqlQuery = `SELECT * FROM NewsPost`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new News(row.NewsID, row.NewsImage, row.NewsDesc, row.NewsSource));
    }

    static async getNewsById(newsId) {
        const connection = await sql.connect(dbConfig);
     
        const sqlQuery = `SELECT * FROM NewsPost WHERE NewsID = @newsId`;

        const request = connection.request();
        request.input("newsId", newsId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new News(row.NewsID, row.NewsImage, row.NewsDesc, row.NewsSource, row.NewsContent, row.NewsUrl, row.NewsDate));
    }

    

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

    static async updateNews(newsId, newNewsData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `UPDATE NewsPost SET NewsImage = @newsImage, NewsDesc = @newsDesc, NewsSource = @newsSource, WHERE NewsID = @newsId`;

        const request = connection.request();
        request.input("newsId", newsId);
        request.input("newsImage", newNewsData.newsImage || null);
        request.input("newsDesc", newNewsData.newsDesc || null);
        request.input("newsSource", newNewsData.newsSource || null);

        await request.query(sqlQuery);

        connection.close();

        return this.getNewsById(newsId);
    }

    static async deleteNews(newsId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM NewsPost WHERE NewsID = @newsId`;

        const request = connection.request();
        request.input("newsId", newsId);
        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = News;