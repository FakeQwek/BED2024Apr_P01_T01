DROP TABLE Volunteer; 
DROP TABLE DiscussionAdmin; 
DROP TABLE PostReport; 
DROP TABLE DiscussionReport; 
DROP TABLE Comment; 
DROP TABLE Post; 
DROP TABLE Discussion; 
DROP TABLE Account;
DROP TABLE NewsPost; 
 
CREATE TABLE Account (      
AccName varchar(16) NOT NULL,  
AccEmail varchar(64) NOT NULL,      
Password varchar(255) NOT NULL, 
isAdmin varchar(5) NOT NULL,     
isMuted varchar(5) NOT NULL,  
isBanned varchar(6) NOT NULL,     
CONSTRAINT PK_Account PRIMARY KEY (AccName),  
CONSTRAINT CHK_Account_isAdmin CHECK (isAdmin IN ('True', 'False')),
CONSTRAINT CHK_Account_isMuted CHECK (isMuted IN ('True', 'False')),
CONSTRAINT CHK_Account_isBanned CHECK (isBanned IN ('True', 'False'))); 
 
CREATE TABLE Discussion ( 
 DscName varchar(16) NOT NULL, 
 DscDesc varchar(100) NULL,
 DscType varchar(10) NOT NULL,
 OwnerID varchar(16) NOT NULL, 
 CONSTRAINT PK_Discussion PRIMARY KEY (DscName), 
 CONSTRAINT FK_Discussion_OwnerID FOREIGN KEY (OwnerID) 
 REFERENCES Account(AccName)); 
 
CREATE TABLE Post ( 
 PostID varchar(10) NOT NULL, 
 PostName varchar(100) NOT NULL, 
 PostDesc varchar(1000) NOT NULL, 
 isEvent varchar(5) NOT NULL, 
 isApproved varchar(5) NOT NULL, 
 OwnerID varchar(16) NOT NULL, 
 DscName varchar(16) NOT NULL 
 CONSTRAINT PK_Post PRIMARY KEY (PostID), 
 CONSTRAINT FK_Post_OwnerID FOREIGN KEY (OwnerID) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_Post_DscName FOREIGN KEY (DscName) 
 REFERENCES Discussion(DscName), 
 CONSTRAINT CHK_Post_isEvent CHECK (isEvent IN ('True', 'False')), 
 CONSTRAINT CHK_Post_isApproved CHECK (isApproved IN ('True', 'False'))); 
 
CREATE TABLE Comment ( 
 CmtID varchar(10) NOT NULL, 
 CmtDesc varchar(1000) NOT NULL, 
 OwnerID varchar(16) NOT NULL, 
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
 PostID varchar(10) NOT NULL 
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
isApproved varchar(5) NOT NULL, 
 PostID varchar(10) NOT NULL 
 CONSTRAINT PK_Volunteer PRIMARY KEY (VolID), 
 CONSTRAINT FK_Volunteer_AccName FOREIGN KEY (AccName) 
 REFERENCES Account(AccName), 
 CONSTRAINT FK_Volunteer_PostID FOREIGN KEY (PostID) 
 REFERENCES Post(PostID), 
CONSTRAINT CHK_Volunteer_isApproved CHECK (isApproved IN ('True', 'False')));

CREATE TABLE NewsPost (
 NewsID varchar(100) NOT NULL,
 NewsDesc varchar(100) NOT NULL,
 NewsSource varchar(100) NOT NULL,
 NewsImage varchar(100) NOT NULL,
 CONSTRAINT PK_NewsPost PRIMARY KEY (NewsID)
)

CREATE TABLE DiscussionMember (
 DscMemID varchar(10) NOT NULL,
 AccName varchar(16) NOT NULL,
 DscName varchar(16) NOT NULL
 CONSTRAINT PK_DiscussionMember PRIMARY KEY (DscMemID),
 CONSTRAINT FK_DiscussionMember_AccName FOREIGN KEY (AccName)
 REFERENCES Account(AccName),
 CONSTRAINT FK_DiscussionMember_DscName FOREIGN KEY (DscName)
 REFERENCES Discussion(DscName),
 CONSTRAINT AK_AccName_DscName UNIQUE (AccName, DscName));