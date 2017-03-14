SELECT * FROM users
JOIN organization ON users.org_id = organization.id
WHERE organization.id = $1;
