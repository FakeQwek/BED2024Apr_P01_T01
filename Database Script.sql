DROP TABLE Volunteer; 
DROP TABLE DiscussionAdmin; 
DROP TABLE PostReport; 
DROP TABLE DiscussionReport; 
DROP TABLE Comment; 
DROP TABLE Post; 
DROP TABLE BanInfo;
DROP TABLE MuteInfo;
DROP TABLE NewsPost;
DROP TABLE Question;
DROP TABLE Account; 
DROP TABLE Discussion; 
 



 


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

INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Johnathon', 'johnathon@gmail.com', 'password', '87665467', 'False', 'False', 'False', 'Not allowed', 'Male', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Marcus','Marcus@gmail.com', 'password2', '97665467', 'False', 'False', 'False', 'Not allowed', 'Male', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Abigail', 'Abigail@gmail.com', 'password3', '92665467', 'False', 'False', 'False', 'Not allowed', 'Female', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Cameron', 'Cameron@gmail.com', 'password4', '91665467', 'False', 'True', 'False', 'Not allowed', 'Female', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Elizabeth','Elizabeth@gmail.com', 'password5', '91635267', 'False', 'True', 'True', 'Not allowed', 'Female', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Lily','Lily@gmail.com', 'password6', '91639267', 'False', 'True', 'False', 'Not allowed', 'Female', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Riley','Riley@gmail.com', 'password7', '41635267', 'False', 'False', 'True', 'Not allowed', 'Female', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Miley','Miley@gmail.com', 'password8', '91635267', 'False', 'False', 'True', 'Not allowed', 'Female', 'English');
INSERT INTO Account (AccName, AccEmail, Password, PhoneNumber, isAdmin, isMuted, isBanned, EmailNotification, Gender, Language)
VALUES ('Michellye','Michellye@gmail.com', 'password9', '91633267', 'False', 'True', 'True', 'allowed', 'Female', 'English');
 
CREATE TABLE Discussion ( 
    DscName varchar(16) NOT NULL, 
    DscDesc varchar(100) NULL,
    DscType varchar(10) NOT NULL,
    OwnerID varchar(16) NOT NULL, 
    CONSTRAINT PK_Discussion PRIMARY KEY (DscName), 
    CONSTRAINT FK_Discussion_OwnerID FOREIGN KEY (OwnerID) 
    REFERENCES Account(AccName)); 


INSERT INTO Discussion (DscName, DscDesc, DscType, OwnerID) VALUES
('ClimateAction', 'Discuss strategies and actions to combat climate change and its effects.', 'Public', 'Johnathon');
INSERT INTO Discussion (DscName, DscDesc, DscType, OwnerID) VALUES
('EqualityForAll', 'Explore topics around equality, social justice, and human rights.', 'Public', 'Marcus');
INSERT INTO Discussion (DscName, DscDesc, DscType, OwnerID) VALUES
('Community', 'Share ideas and projects related to improving local communities and neighborhoods.', 'Public', 'Abigail');
INSERT INTO Discussion (DscName, DscDesc, DscType, OwnerID) VALUES
('EducationReform', 'Debate and propose changes to the education system to benefit all students.', 'Public', 'Cameron');
INSERT INTO Discussion (DscName, DscDesc, DscType, OwnerID) VALUES
('PublicHealth', 'Discuss public health issues, policies, and initiatives for community well-being.', 'Public', 'Elizabeth');



CREATE TABLE Post ( 
    PostID varchar(10) NOT NULL, 
    PostName varchar(100) NOT NULL, 
    PostDesc varchar(1000) NOT NULL, 
    isEvent varchar(5) NOT NULL, 
    isApproved varchar(5) NOT NULL,
    PostDate varchar(10) NOT NULL,
    PostEventDate varchar(10) NULL,
    OwnerID varchar(16) NOT NULL, 
    DscName varchar(16) NOT NULL 
    CONSTRAINT PK_Post PRIMARY KEY (PostID), 
    CONSTRAINT FK_Post_DscName FOREIGN KEY (DscName) 
    REFERENCES Discussion(DscName), 
    CONSTRAINT CHK_Post_isEvent CHECK (isEvent IN ('True', 'False')), 
    CONSTRAINT CHK_Post_isApproved CHECK (isApproved IN ('True', 'False'))); 

    INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, PostDate, PostEventDate, OwnerID, DscName) VALUES
    ('1', 'Climate Change Seminar', 'A seminar discussing the latest research and strategies for combating climate change.', 'True', 'True', '30/07/2024', NULL, 'Johnathon', 'ClimateAction');
    INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, PostDate, PostEventDate, OwnerID, DscName) VALUES
    ('2', 'Equal Rights Workshop', 'Workshop focused on exploring practical approaches to achieving social equality.', 'False', 'True', '28/07/2024', NULL, 'Marcus', 'EqualityForAll');
    INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, PostDate, PostEventDate, OwnerID, DscName) VALUES
    ('3', 'Community Cleanup Drive', 'Organizing a community cleanup drive to improve local parks and public spaces.', 'True', 'False', '29/07/2024', NULL, 'Abigail', 'Community');
    INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, PostDate, PostEventDate, OwnerID, DscName) VALUES
    ('4', 'Education Reform Panel', 'Panel discussion on the future of education and necessary reforms to improve student outcomes.', 'True', 'False', '11/07/2024', NULL, 'Cameron', 'EducationReform');
    INSERT INTO Post (PostID, PostName, PostDesc, isEvent, isApproved, PostDate, PostEventDate, OwnerID, DscName) VALUES
    ('5', 'Public Health Awareness Campaign', 'Campaign to raise awareness about preventive measures and health tips for the public.', 'True', 'False', '18/07/2024', NULL, 'Elizabeth', 'PublicHealth');

    



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
    OwnerID varchar(16) NOT NULL, 
    PostId varchar(10) NOT NULL 
    CONSTRAINT PK_Comment PRIMARY KEY (CmtID), 
    CONSTRAINT FK_Comment_OwnerID FOREIGN KEY (OwnerID) 
    REFERENCES Account(AccName), 
    CONSTRAINT FK_Comment_PostID FOREIGN KEY (PostID) 
    REFERENCES Post(PostID)); 
    
    INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) VALUES
    ('1', 'This is a great post! Really enjoyed reading it.', 'Abigail', '1');
    INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) VALUES
    ('2', 'I completely disagree with this point of view.', 'Cameron', '2');
    INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) VALUES
    ('3', 'Can someone provide more details on this topic?', 'Elizabeth', '3');
    INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) VALUES
    ('4', 'Fantastic insights, thanks for sharing!', 'Johnathon', '4');
    INSERT INTO Comment (CmtID, CmtDesc, OwnerID, PostID) VALUES
    ('5', 'I think there are some errors in the analysis.', 'Lily', '5');
 

CREATE TABLE DiscussionReport (
    DscRptID varchar(10) NOT NULL,
    DscRptCat varchar(100) NOT NULL,
    DscRptDesc varchar(100) NOT NULL,
    AccName varchar(16) NOT NULL,
    DscName varchar(16) NOT NULL,
    Warned BIT DEFAULT 0,
    CONSTRAINT PK_DiscussionReport PRIMARY KEY (DscRptID),
    CONSTRAINT FK_DiscussionReport_AccName FOREIGN KEY (AccName)
    REFERENCES Account(AccName),
    CONSTRAINT FK_DiscussionReport_DscName FOREIGN KEY (DscName)
    REFERENCES Discussion(DscName));  

    INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName) VALUES
    ('1', 'Inappropriate Content', 'This discussion contains offensive material.', 'Abigail', 'ClimateAction');
    INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName) VALUES
    ('2', 'Spam', 'The discussion is filled with spam messages.', 'Cameron', 'Community');
    INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName) VALUES
    ('3', 'False Information', 'This discussion contains misleading information.', 'Miley', 'EducationReform');
    INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName) VALUES
    ('4', 'Harassment', 'User is being harassed in this discussion.', 'Riley', 'EqualityForAll');
    INSERT INTO DiscussionReport (DscRptID, DscRptCat, DscRptDesc, AccName, DscName) VALUES
    ('5', 'Off-topic', 'Discussion is going off-topic and should be moderated.', 'Johnathon', 'PublicHealth');
 
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

    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('1', 'Inappropriate Content', 'The post contains offensive language and inappropriate content.', 'Johnathon', '1');
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('2', 'False Information', 'The post spreads misinformation regarding climate change facts.', 'Marcus', '2');   
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('3', 'Spam', 'The post appears to be spam or irrelevant advertising.', 'Abigail', '3');
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('4', 'Hate Speech', 'The post includes discriminatory language against certain groups.', 'Cameron', '4');
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('5', 'Privacy Violation', 'The post includes private information about individuals without consent.', 'Elizabeth', '5');
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('6', 'Misleading Title', 'The title of the post does not accurately reflect its content.', 'Johnathon', '1');
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('7', 'Offensive Imagery', 'The post contains images that are deemed offensive or inappropriate.', 'Marcus', '2');
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('9', 'Duplicated Content', 'The post is a duplicate of another post already on the platform.', 'Cameron', '4');
    INSERT INTO PostReport (PostRptID, PostRptCat, PostRptDesc, AccName, PostID) VALUES
    ('10', 'Incorrect Data', 'The post contains incorrect or misleading data about public health policies.', 'Elizabeth', '5');
    
 
CREATE TABLE DiscussionAdmin ( 
    DscAdmID varchar(10) NOT NULL, 
    AccName varchar(16) NOT NULL, 
    DscName varchar(16) NOT NULL 
    CONSTRAINT PK_DiscussionAdmin PRIMARY KEY (DscAdmID), 
    CONSTRAINT FK_DiscussionAdmin_AccName FOREIGN KEY (AccName) 
    REFERENCES Account(AccName), 
    CONSTRAINT FK_DiscussionAdmin_DscName FOREIGN KEY (DscName) 
    REFERENCES Discussion(DscName)); 

    INSERT INTO DiscussionAdmin (DscAdmID, AccName, DscName) VALUES 
    ('DA1', 'Johnathon', 'ClimateAction');
    INSERT INTO DiscussionAdmin (DscAdmID, AccName, DscName) VALUES 
    ('DA2', 'Lily', 'Community');
    INSERT INTO DiscussionAdmin (DscAdmID, AccName, DscName) VALUES 
    ('DA3', 'Riley', 'EducationReform');
    INSERT INTO DiscussionAdmin (DscAdmID, AccName, DscName) VALUES 
    ('DA4', 'Miley', 'PublicHealth');
    

    
 
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
    CONSTRAINT CHK_Volunteer_isApproved CHECK (isApproved IN ('True', 'False')),
    CONSTRAINT AK_Volunteer_AccName_PostID UNIQUE (AccName, PostID));

    INSERT INTO Volunteer (VolID, AccName, isApproved, PostID) VALUES 
    ('1', 'Johnathon', 'True', '2');
     INSERT INTO Volunteer (VolID, AccName, isApproved, PostID) VALUES 
    ('2', 'Michellye', 'True', '3');
     INSERT INTO Volunteer (VolID, AccName, isApproved, PostID) VALUES 
    ('3', 'Abigail', 'True', '4');
     INSERT INTO Volunteer (VolID, AccName, isApproved, PostID) VALUES 
    ('4', 'Riley', 'True', '1');


CREATE TABLE BanInfo (
    AccName varchar(16) NOT NULL,
    banDate DATETIME NOT NULL DEFAULT GETDATE(),
    banReason varchar(255) NOT NULL,
    bannedBy varchar(16) NOT NULL,
    DscName varchar(16) NOT NULL,
    CONSTRAINT FK_Account_BanInfo FOREIGN KEY (AccName) REFERENCES Account (AccName),
    CONSTRAINT FK_DscName_BanInfo FOREIGN KEY (DscName) REFERENCES Discussion (DscName)
);

    INSERT INTO BanInfo (AccName, banDate, banReason, bannedBy, DscName) VALUES
    ('Cameron', '2024-07-22 10:15:00', 'Violation of community guidelines', 'Johnathon', 'health_tech'),
    ('Elizabeth', '2024-07-23 09:00:00', 'Repeated rule violations.', 'Abigail', 'nutrition'),
    ('Marcus', '2024-07-26 13:00:00', 'Repeated offenses.', 'Riley', 'mental_health_support'),
    ('Michellye', '2024-07-27 14:00:00', 'Violating guidelines.', 'Marcus', 'child_health');


CREATE TABLE MuteInfo (
    AccName VARCHAR(16) NOT NULL,
    muteDate DATETIME NOT NULL DEFAULT GETDATE(),
    muteReason VARCHAR(255) NOT NULL,
    mutedBy VARCHAR(16) NOT NULL,
    DscName varchar(16) NOT NULL,
    CONSTRAINT FK_Account_MuteInfo FOREIGN KEY (AccName) REFERENCES Account (AccName),
    CONSTRAINT FK_DscName_MuteInfo FOREIGN KEY (DscName) REFERENCES Discussion (DscName)
);

 INSERT INTO BanInfo (AccName, banDate, banReason, bannedBy, DscName) VALUES
    ('Cameron', '2024-07-22 10:15:00', 'Violation of community guidelines', 'Johnathon', 'ClimateAction'),
    ('Elizabeth', '2024-07-23 09:00:00', 'Repeated rule violations.', 'Abigail', 'Community'),
    ('Marcus', '2024-07-26 13:00:00', 'Repeated offenses.', 'Riley', 'EducationReform'),
    ('Michellye', '2024-07-27 14:00:00', 'Violating guidelines.', 'Marcus', 'PublicHealth');

CREATE TABLE Question (
    QuestionID VARCHAR(16) NOT NULL,
    Name varchar(255) NOT NULL,
    Email varchar(255) NOT NULL,
    Query varchar(255) NOT NULL,
    CONSTRAINT PK_Question PRIMARY KEY(QuestionID)

);

CREATE TABLE DiscussionMember (
    DscMemID varchar(10) NOT NULL,
    DscMemRole varchar(6) NOT NULL,
    isMuted varchar(5) NOT NULL,
    isBanned varchar(5) NOT NULL,
    AccName varchar(16) NOT NULL,
    DscName varchar(16) NOT NULL
    CONSTRAINT PK_DiscussionMember PRIMARY KEY (DscMemID),
    CONSTRAINT FK_DiscussionMember_AccName FOREIGN KEY (AccName)
    REFERENCES Account(AccName),
    CONSTRAINT FK_DiscussionMember_DscName FOREIGN KEY (DscName)
    REFERENCES Discussion(DscName),
    CONSTRAINT CHK_DiscussionMember_isMuted CHECK (isMuted IN ('True', 'False')),
    CONSTRAINT CHK_DiscussionMember_isBanned CHECK (isBanned IN ('True', 'False')),
    CONSTRAINT AK_AccName_DscName UNIQUE (AccName, DscName));

CREATE TABLE PostLike (
    PostLikeID varchar(10) NOT NULL,
    AccName varchar(16) NOT NULL,
    PostID varchar(10) NOT NULL
    CONSTRAINT PK_PostLike PRIMARY KEY (PostLikeID),
    CONSTRAINT FK_PostLike_AccName FOREIGN KEY (AccName)
    REFERENCES Account(AccName),
    CONSTRAINT FK_PostLike_PostID FOREIGN KEY (PostID)
    REFERENCES Post(PostID),
    CONSTRAINT AK_AccName_PostID UNIQUE (AccName, PostID));

CREATE TABLE Invite (
    InvID varchar(10) NOT NULL,
    AccName varchar(16) NOT NULL,
    DscName varchar(16) NOT NULL,
    CONSTRAINT PK_Invite PRIMARY KEY (InvID),
    CONSTRAINT FK_Invite_AccName FOREIGN KEY (AccName)
    REFERENCES Account(AccName),
    CONSTRAINT FK_Invite FOREIGN KEY (DscName)
    REFERENCES Discussion(DscName),
    CONSTRAINT AK_Invite_AccName_DscName UNIQUE (AccName, DscName));

CREATE TABLE Feedback (
    FeedbackID INT IDENTITY(1,1) PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    RatingStar INT NOT NULL,
    FeedbackDescription VARCHAR(MAX) NOT NULL
);


