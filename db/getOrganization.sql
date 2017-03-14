SELECT * FROM organization
JOIN users ON organization.id = users.org_id
WHERE users.id = $1;
