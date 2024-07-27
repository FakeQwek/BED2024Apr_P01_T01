DROP TABLE Volunteer; 
DROP TABLE DiscussionAdmin; 
DROP TABLE PostReport; 
DROP TABLE DiscussionReport; 
DROP TABLE Comment; 
DROP TABLE Post; 
DROP TABLE Discussion; 
DROP TABLE Account; 
DROP TABLE BanInfo;
DROP TABLE MuteInfo;
DROP TABLE NewsPost;
DROP TABLE Question;
 
CREATE TABLE Account (      
AccName varchar(16) NOT NULL,  
AccEmail varchar(64) NOT NULL,      
Password varchar(255) NOT NULL, 
isAdmin varchar(5) NOT NULL,     
isMuted varchar(5) NOT NULL,  
isBanned varchar(6) NOT NULL,     
CONSTRAINT PK_Account PRIMARY KEY (AccName),  
CONSTRAINT CHK_Account_isAdmin CHECK (isAdmin IN ('True', 'False')),     CONSTRAINT CHK_Account_isMuted CHECK (isMuted IN ('True', 'False')),
CONSTRAINT CHK_Account_isBanned CHECK (isBanned IN ('True', 'False'))); 

CREATE TABLE Account (      
    AccName varchar(16) NOT NULL,  
    AccEmail varchar(64) NOT NULL,      
    Password varchar(255) NOT NULL, 
    PhoneNumber varchar(15),
    isAdmin varchar(5) NOT NULL,     
    isMuted varchar(5) NOT NULL,  
    isBanned varchar(6) NOT NULL,
    EmailNotification varchar(20) NOT NULL DEFAULT 'Not allowed',
    Gender varchar(10) NOT NULL DEFAULT 'NIL',
    Language varchar(20) NOT NULL DEFAULT 'English',     
    CONSTRAINT PK_Account PRIMARY KEY (AccName),  
    CONSTRAINT CHK_Account_isAdmin CHECK (isAdmin IN ('True', 'False')),     
    CONSTRAINT CHK_Account_isMuted CHECK (isMuted IN ('True', 'False')),
    CONSTRAINT CHK_Account_isBanned CHECK (isBanned IN ('True', 'False')),
    CONSTRAINT CHK_Account_EmailNotification CHECK (EmailNotification IN ('allowed', 'Not allowed')),
    CONSTRAINT CHK_Account_Gender CHECK (Gender IN ('Male', 'Female', 'NIL'))
);

 
CREATE TABLE Discussion ( 
 DscName varchar(16) NOT NULL, 
 DscDesc varchar(100) NULL, 
 OwnerID varchar(10) NOT NULL, 
 CONSTRAINT PK_Discussion PRIMARY KEY (DscName), 
 CONSTRAINT FK_Discussion_OwnerID FOREIGN KEY (OwnerID) 
 REFERENCES Account(AccName)); 
 
CREATE TABLE Post ( 
 PostID varchar(10) NOT NULL, 
 PostName varchar(100) NOT NULL, 
 PostDesc varchar(1000) NOT NULL, 
 isEvent varchar(5) NOT NULL, 
 isApproved varchar(5) NOT NULL, 
 OwnerID varchar(10) NOT NULL, 
 DscName varchar(16) NOT NULL 
 CONSTRAINT PK_Post PRIMARY KEY (PostID), 
 CONSTRAINT FK_Post_OwnerID FOREIGN KEY (OwnerID) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_Post_DscName FOREIGN KEY (DscName) 
 REFERENCES Discussion(DscName), 
 CONSTRAINT CHK_Post_isEvent CHECK (isEvent IN ('True', 'False')), 
 CONSTRAINT CHK_Post_isApproved CHECK (isApproved IN ('True', 'False'))); 

 CREATE TABLE NewsPost (
	NewsID varchar(1000) NOT NULL,
	NewsDesc varchar(1000) NOT NULL,
	NewsSource varchar(1000) NOT NULL,
	NewsImage varchar(1000) NOT NULL,
    NewsDate varchar(10) NOT NULL,
    NewsContent varchar(2500) NOT NULL,
    NewsUrl varchar(1000) NOT NULL,
	CONSTRAINT PK_NewsPost PRIMARY KEY (NewsID));
 
CREATE TABLE Comment ( 
 CmtID varchar(10) NOT NULL, 
 CmtDesc varchar(1000) NOT NULL, 
 OwnerID varchar(10) NOT NULL, 
 PostId varchar(10) NOT NULL 
 CONSTRAINT PK_Comment PRIMARY KEY (CmtID), 
 CONSTRAINT FK_Comment_OwnerID FOREIGN KEY (OwnerID) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_Comment_PostID FOREIGN KEY (PostID) 
 REFERENCES Post(PostID)); 
 
CREATE TABLE DiscussionReport ( 
 DscRptID varchar(10) NOT NULL, 
 DscRptCat varchar(100) NOT NULL, 
 DscRptDesc varchar(100) NOT NULL, 
 AccName varchar(16) NOT NULL, 
 DscName varchar(16) NOT NULL 
 CONSTRAINT PK_DiscussionReport PRIMARY KEY (DscRptID), 
 CONSTRAINT FK_DiscussionReport_AccName FOREIGN KEY (AccName) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_DiscussionReport_DscName FOREIGN KEY (DscName) 
 REFERENCES Discussion(DscName)); 
 
CREATE TABLE PostReport ( 
 PostRptID varchar(10) NOT NULL, 
 PostRptCat varchar(100) NOT NULL, 
 PostRptDesc varchar(100) NOT NULL, 
 AccName varchar(16) NOT NULL, 
 PostID varchar(10) NOT NULL,
 CONSTRAINT PK_PostReport PRIMARY KEY (PostRptID), 
 CONSTRAINT FK_PostReport_AccName FOREIGN KEY (AccName) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_PostReport_PostID FOREIGN KEY (PostID) 
 REFERENCES Post(PostID)); 
 
CREATE TABLE DiscussionAdmin ( 
 DscAdmID varchar(10) NOT NULL, 
 AccName varchar(16) NOT NULL, 
 DscName varchar(16) NOT NULL 
 CONSTRAINT PK_DiscussionAdmin PRIMARY KEY (DscAdmID), 
 CONSTRAINT FK_DiscussionAdmin_AccName FOREIGN KEY (AccName) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_DiscussionAdmin_DscName FOREIGN KEY (DscName) 
 REFERENCES Discussion(DscName)); 
 
CREATE TABLE Volunteer ( 
 VolID varchar(10) NOT NULL, 
 AccName varchar(16) NOT NULL, 
isApproved, 
 PostID varchar(10) NOT NULL 
 CONSTRAINT PK_Volunteer PRIMARY KEY (VolID), 
 CONSTRAINT FK_Volunteer_AccName FOREIGN KEY (AccName) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_Volunteer_PostID FOREIGN KEY (PostID) 
 REFERENCES Post(PostID), 
CONSTRAINT CHK_Volunteer_isApproved CHECK (isApproved IN ('True', 'False')));

CREATE TABLE BanInfo (
    AccName varchar(16) NOT NULL,
    banDate DATETIME NOT NULL DEFAULT GETDATE(),
    banReason varchar(255) NOT NULL,
    bannedBy varchar(16) NOT NULL,
    DscName varchar(16) NOT NULL,
    CONSTRAINT FK_Account_BanInfo FOREIGN KEY (AccName) REFERENCES Account (AccName),
    CONSTRAINT FK_DscName_BanInfo FOREIGN KEY (DscName) REFERENCES Discussion (DscName)
);

CREATE TABLE MuteInfo (
    AccName VARCHAR(16) NOT NULL,
    muteDate DATETIME NOT NULL DEFAULT GETDATE(),
    muteReason VARCHAR(255) NOT NULL,
    mutedBy VARCHAR(16) NOT NULL,
    DscName varchar(16) NOT NULL,
    CONSTRAINT FK_Account_MuteInfo FOREIGN KEY (AccName) REFERENCES Account (AccName),
    CONSTRAINT FK_DscName_MuteInfo FOREIGN KEY (DscName) REFERENCES Discussion (DscName)
);

CREATE TABLE Question (
    QuestionID int NOT NULL,
    Name varchar(255) NOT NULL,
    Email varchar(255) NOT NULL,
    Query varchar(255) NOT NULL,
    CONSTRAINT PK_Question PRIMARY KEY(QuestionID)

);
