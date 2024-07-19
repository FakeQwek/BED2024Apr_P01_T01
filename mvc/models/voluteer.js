const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Volunteer {
    constructor(volId, accName, isApproved, postId) {
        this.volId = volId;
        this.accName = accName;
        this.isApproved = isApproved;
        this.postId = postId;
    }

    static async getAllVolunteers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteer`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Volunteer(row.VolID, row.AccName, row.isApproved, row.PostID));
    }

    static async getVolunteerById(volId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteer WHERE VolID = @volId`;

        const request = connection.request();
        request.input("volId", volId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset[0]
            ? new Volunteer(
                result.recordset[0].VolID,
                result.recordset[0].AccName,
                result.recordset[0].isApproved,
                result.recordset[0].PostID
            )
            : null;
    }

    static async getVolunteersByPost(postId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteer WHERE PostID = @postId`;

        const request = connection.request();
        request.input("postId", postId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Volunteer(row.VolID, row.AccName, row.isApproved, row.PostID));
    }

    static async createVolunteer(newVolunteerData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Volunteer (VolID, AccName, isApproved, PostID) SELECT CASE WHEN COUNT(*) = 0 THEN 1 ELSE MAX(VolID) + 1 END, @accName, @isApproved, @postId FROM Volunteer;`;

        const request = connection.request();
        request.input("accName", newVolunteerData.accName);
        request.input("isApproved", newVolunteerData.isApproved);
        request.input("postId", newVolunteerData.postId);

        const result = await request.query(sqlQuery);

        connection.close();
    }

    static async deleteVolunteer(volId) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `DELETE FROM Volunteer WHERE VolID = @volId`;

        const request = connection.request();
        request.input("volId", volId);
        const result = await request.query(sqlQuery);

        connection.close();

        return result;
    }

    static async approveVolunteer(volId) {
        const connection = await sql.connect(dbConfig);
        
        const sqlQuery = `UPDATE Volunteer SET isApproved = 'True' WHERE VolID = @volId`

        const request = connection.request();
        request.input("volId", volId);
        const result = await request.query(sqlQuery);

        connection.close();

        return this.getVolunteerById(volId);
    }
}

module.exports = Volunteer;