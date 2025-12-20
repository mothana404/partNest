const User = require('./User');
const Student = require('./Student');
const Company = require('./Company');
const Category = require('./Category');
const Job = require('./Job');
const Tag = require('./Tag');
const Application = require('./Application');
const SavedJob = require('./SavedJob');
const Skill = require('./Skill');
const Experience = require('./Experience');
const Link = require('./Link');
const JobView = require('./JobView')

User.hasOne(Student, { foreignKey: 'userId', as: 'student', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Company, { foreignKey: 'userId', as: 'company', onDelete: 'CASCADE' });
Company.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Skill, { foreignKey: 'userId', as: 'skills', onDelete: 'CASCADE' });
Skill.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Experience, { foreignKey: 'userId', as: 'experiences', onDelete: 'CASCADE' });
Experience.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Link, { foreignKey: 'userId', as: 'links', onDelete: 'CASCADE' });
Link.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

Category.hasMany(Job, { foreignKey: 'categoryId', as: 'jobs' });
Job.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Job.belongsToMany(Tag, { through: 'JobTags', as: 'tags' });
Tag.belongsToMany(Job, { through: 'JobTags', as: 'jobs' });

Student.hasMany(Application, { foreignKey: 'studentId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications', onDelete: 'CASCADE' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

Student.hasMany(SavedJob, { foreignKey: 'studentId', as: 'savedJobs', onDelete: 'CASCADE' });
SavedJob.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Job.hasMany(SavedJob, { foreignKey: 'jobId', as: 'savedBy', onDelete: 'CASCADE' });
SavedJob.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

Student.hasMany(JobView, { 
  foreignKey: 'studentId', 
  as: 'jobViews', 
  onDelete: 'CASCADE' 
});
JobView.belongsTo(Student, { 
  foreignKey: 'studentId', 
  as: 'student' 
});

Job.hasMany(JobView, { 
  foreignKey: 'jobId', 
  as: 'jobViews', 
  onDelete: 'CASCADE' 
});
JobView.belongsTo(Job, { 
  foreignKey: 'jobId', 
  as: 'job' 
});

// Many-to-many through JobView with explicit foreign keys
Student.belongsToMany(Job, { 
  through: {
    model: JobView,
    unique: false // Allow the through model to handle uniqueness
  },
  foreignKey: 'studentId',
  otherKey: 'jobId',
  as: 'viewedJobs' 
});

Job.belongsToMany(Student, { 
  through: {
    model: JobView,
    unique: false
  },
  foreignKey: 'jobId',
  otherKey: 'studentId',
  as: 'viewedByStudents' 
});

module.exports = {
  User,
  Student,
  Company,
  Category,
  Job,
  Tag,
  Application,
  SavedJob,
  Skill,
  Experience,
  Link,
  JobView
};