create database Family
use Family
CREATE TABLE Person(
 Person_Id INT PRIMARY KEY,
 Personal_Name VARCHAR(50),
 Family_Name VARCHAR(50),
 GENDER VARCHAR(10),
 Father_Id INT,
 Mother_Id INT,
 Spouse_Id INT,
 FOREIGN KEY (Father_Id) REFERENCES Person(Person_Id),
 FOREIGN KEY (Mother_Id) REFERENCES Person(Person_Id),
 FOREIGN KEY (Spouse_Id) REFERENCES Person(Person_Id)
)
CREATE TABLE FamilyTree (
    Person_Id INT,
    Relative_Id INT,
    Connection_Type VARCHAR(10),
    PRIMARY KEY (Person_Id, Relative_Id),
    FOREIGN KEY (Person_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY (Relative_Id) REFERENCES Person(Person_Id)
);

UPDATE P
SET P.Spouse_Id = X.Person_Id
FROM Person P
JOIN Person X 
ON P.Person_Id=X.Spouse_Id
WHERE P.Spouse_Id IS NULL

INSERT INTO Person (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) 
VALUES 
(1, 'דני', 'כהן', 'זכר', NULL, NULL, 2), 
(2, 'רונית', 'כהן', 'נקבה', NULL, NULL, 1), 
(3, 'יוסי', 'כהן', 'זכר', 1, 2, NULL), 
(4, 'נועה', 'כהן', 'נקבה', 1, 2, NULL);

-- קשרי הורים
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type) VALUES
(3, 1, 'אבא'),
(3, 2, 'אמא'),
(4, 1, 'אבא'),
(4, 2, 'אמא');

-- קשרי אחים
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type) VALUES
(3, 4, 'אחות'),
(4, 3, 'אח');

-- קשרי בני זוג
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type) VALUES
(1, 2, 'בן זוג'),
(2, 1, 'בת זוג');
select * from Person
select * from FamilyTree