const sql = require("mssql");
const dbConfig = require("../../dbConfig");

class Volunteer {
    constructor(volId, accId, postId) {
        this.volId = volId;
        this.accId = accId;
        this.postId = postId;
    }

    static async getAllVolunteers() {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `SELECT * FROM Volunteer`;

        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map((row) => new Volunteer(row.VolID, row.AccID, row.PostID));
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
                result.recordset[0].AccID,
                result.recordset[0].PostID
            )
            : null;
    }

    static async createVolunteer(newVolunteerData) {
        const connection = await sql.connect(dbConfig);

        const sqlQuery = `INSERT INTO Volunteer (VolID, AccID, PostID) SELECT MAX(VolID) + 1, @accId, @postId FROM Volunteer;`;

        const request = connection.request();
        request.input("accId", newVolunteerData.accId);
        request.input("postId", newVolunteerData.postId);

        const result = await request.query(sqlQuery);

        connection.close();
    }
}

module.exports = Volunteer;