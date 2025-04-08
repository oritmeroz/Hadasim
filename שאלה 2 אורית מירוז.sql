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
(1, '���', '���', '���', NULL, NULL, 2), 
(2, '�����', '���', '����', NULL, NULL, 1), 
(3, '����', '���', '���', 1, 2, NULL), 
(4, '����', '���', '����', 1, 2, NULL);

-- ���� �����
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type) VALUES
(3, 1, '���'),
(3, 2, '���'),
(4, 1, '���'),
(4, 2, '���');

-- ���� ����
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type) VALUES
(3, 4, '����'),
(4, 3, '��');

-- ���� ��� ���
INSERT INTO FamilyTree (Person_Id, Relative_Id, Connection_Type) VALUES
(1, 2, '�� ���'),
(2, 1, '�� ���');
select * from Person
select * from FamilyTree