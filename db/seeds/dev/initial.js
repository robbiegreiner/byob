const fs = require('fs');

const employeeData = fs.readFileSync('./db/seeds/dev/employees.tsv', 'utf8');
const projectData = fs.readFileSync('./db/seeds/dev/projects.tsv', 'utf8');
const employeeProjectData = fs.readFileSync('./db/seeds/dev/employees_projects.tsv', 'utf8');



const parser = (data) => {
  const allLines = data.split(/\r\n|\n/);
  const headers = allLines.shift().split('\t');

  return allLines.map(line => line.split('\t')).map(row => {
    return row.reduce((accum, column, i) => {
      const cleanColumn = column.replace(/[''"]+/g, '');
      if (!cleanColumn) {
        return;
      }
      return Object.assign(accum, { [headers[i]]: cleanColumn });
    }, {});
  });
};

exports.seed = (knex, Promise) => {
  console.log(parser(projectData));

  return knex('employees_projects').del()
    .then(() => knex('projects').del())
    .then(() => knex('employees').del())
    .then(() => {
      // Inserts seed entries
      return knex('employees').insert(parser(employeeData));
    })
    .then(() => {
      return knex('projects').insert(parser(projectData));
    })
    .then(() => {
      return knex('employees_projects').insert(parser(employeeProjectData));
    }); //catch

};
