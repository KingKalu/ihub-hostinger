const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
const { differenceInDays } = require('date-fns');
const Task = require('./models/task');
const Group = require('./models/group');
const Role = require('./models/role');
const Chat = require("./models/chat")

const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const postRoutes = require('./routes/post');
const groupRoutes = require('./routes/group');
const commentRoutes = require('./routes/comment');
const documentRoutes = require('./routes/document');
const notificationRoutes = require('./routes/notification');
const roleRoutes = require('./routes/role');
const settingsRoutes = require('./routes/settings');
const departmentRoutes = require('./routes/department');
const unitRoutes = require('./routes/unit');
const feedbackRoutes = require('./routes/feedback');
const roomRoutes = require('./routes/room');
const messageRoutes = require('./routes/message');
const reactionRoutes = require('./routes/reaction');
const readReceiptRoutes = require('./routes/readReceipt');
const courseRoutes = require('./routes/course');
const lessonRoutes = require('./routes/lesson');
const quizRoutes = require('./routes/quiz');
const quoteRoutes = require('./routes/quote');
const itemRoutes = require('./routes/item');

// category routes
const categoryRoutes = require("./routes/category")


const teamRoutes = require('./routes/team');
const teammateRoutes = require('./routes/teammate');
const attachmentTypeRoutes = require('./routes/attachmentType');
const attendantRoutes = require('./routes/attendant');
const responsibilityRoutes = require('./routes/responsibility');

//iPerformance
const taskRoutes = require('./routes/task');
const challengeRoutes = require('./routes/challenge');
const riskRoutes = require('./routes/risk');
const objectiveRoutes = require('./routes/objective');
const goalRoutes = require('./routes/goal');
const weightRoutes = require('./routes/weight');
const periodRoutes = require('./routes/period');


const User = require('./models/user');
const Comment = require('./models/comment');
const Post = require('./models/post');
const Document = require('./models/document');
const Notification = require('./models/notification');
const UnsentNotification = require('./models/unsentNotification');

function connectToDatabase() {
  // updateUsers()
  // updateNotifications()
  // updateunsentNotifications()
  // updateComment()
  // updatePost()
  // updateDocument()
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.localConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4,
      })
      .then(async () => {
        await createDefaultRolesIfAbsent();
        // await generateChat()
        console.log('Connected to local MongoDB');
        resolve();
      })
      .catch((error) => {
        console.error('Failed to connect to local MongoDB:', error.message);
        console.log('Trying fallback connection...');

        mongoose
          .connect(process.env.remoteDeployment, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          .then(async () => {
            console.log('Connected to remote MongoDB');
            // await updateTasks();
            await createDefaultRolesIfAbsent();
            cron.schedule('0 0 * * *', async function () {
              await archiveTasks(); // Your function to archive tasks
            });
            resolve();
          })
          .catch((fallbackError) => {
            console.error(
              'Failed to connect to fallback MongoDB:',
              fallbackError.message
            );
            reject(fallbackError);
          });
      });
  });
}

connectToDatabase();

app.use(cors({
  origin: process.env.frontend_domain,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.get('/api/', (req, res) => {
  res.json({ message: 'iHub Connect 1.0.0.2 - MVP Release : (iPerformance) September 7th 2024' });
});

// Different files upload storage
app.use('/api/images', express.static(path.join(__dirname, 'images')));
app.use(
  '/api/document-library',
  express.static(path.join(__dirname, 'document-library'))
);
app.use('/api/logo', express.static(path.join(__dirname, 'logo')));
app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/ihub', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/chat', messageRoutes);
app.use('/api/reaction', reactionRoutes);
app.use('/api/readReceipt', readReceiptRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/items', itemRoutes);

// category
app.use("/category", categoryRoutes)

//Performance
app.use('/api/iperformance/tasks', taskRoutes);
app.use('/api/iperformance/goals', goalRoutes);
app.use('/api/iperformance/weights', weightRoutes);
app.use('/api/iperformance/risks', riskRoutes);
app.use('/api/iperformance/objectives', objectiveRoutes);
app.use('/api/iperformance/periods', periodRoutes);
app.use('/api/iperformance/challenges', challengeRoutes);
//team
app.use('/api/team', teamRoutes);
app.use('/api/teammate', teammateRoutes);
app.use('/api/settings/attachmentType',  attachmentTypeRoutes);
app.use('/api/time/attendant',  attendantRoutes);
app.use('/api/settings/responsibility', responsibilityRoutes);

// cron job
async function archiveTasks() {
  // loop through the entire group collection
  console.log('Archiving...');
  const tasks = await Task.find({});
  const tasksJson = tasks.map((task) => task.toJSON());

  // look for tasks that have exceeded 1 month from the completion date
  const today = new Date();
  tasksJson.map((task) => {
    if (task.status === 'Completed') {
      const completionAt = new Date(task.completionAt);
      const dayDiff = differenceInDays(today, completionAt);

      if (dayDiff >= 30 && !task.archived) {
        // mark the task as archived
        Task.findByIdAndUpdate(
          task._id, // find the user by id
          { archived: true },
          { new: true }
        );
      }
    }
  });
}

async function createDefaultRolesIfAbsent() {
  const roles = await Role.find({});
  if (roles.length === 0) {
    console.log('Creating default roles...');
    const adminRole = new Role({
      name: 'Admin',
      description: 'Admin Role',
      permissions: [
        'create',
        'update',
        'delete',
        'delete_user',
        'update_user',
        'create_user',
        'assign_role',
        'modify_permission',
        'modify_document',
      ],
    });
    const teamLeadRole = new Role({
      name: 'Team Lead',
      description: 'Team Lead Role',
      permissions: [
        'create',
        'update',
        'delete',
        'update_user',
        'modify_document',
      ],
    });
    const userRole = new Role({
      name: 'User',
      description: 'User Role',
      permissions: [
        'create_own',
        'update_own',
        'delete_own',
        'modify_shared_document',
        'modify_assigned_task',
      ],
    });
    const guestRole = new Role({
      name: 'Guest',
      description: 'Guest Role',
      permissions: [],
    });
    await adminRole.save();
    await teamLeadRole.save();
    await userRole.save();
    await guestRole.save();
  }

  const group = await Group.findOne({
    title: 'iHUB CONNECT MVP - #FEEDBACK',
  });

  if (!group) {
    const newGroup = new Group({
      title: 'iHUB CONNECT MVP - #FEEDBACK',
      createdBy: null,
      description: 'Feedback on ihub connect mvp',
      tasks: [],
    });
    await newGroup.save();
  }
}

async function updateUsers() {
  const users = await User.find({});

  for (let user of users) {
    let updated = false;

    if (user?.avatar) {
      user.avatar = '';
      updated = true;
    }

    if (user?.background) {
      user.background = '';
      updated = true;
    }

    if (updated) {
      await user.save();
      console.log(`User ${user._id} updated successfully`);
    }
  }
}

async function updateNotifications() {
  const notifications = await Notification.find({});

  for (let notification of notifications) {
    let updated = false;

    if (
      notification?.image?.includes('http://www.izone5_api.ihubconnect.com')
    ) {
      notification.image = notification.image.replace(
        'http://www.izone5_api.ihubconnect.com',
        ''
      );
      updated = true;
    }

    if (updated) {
      await notification.save();
      console.log(`Notification ${notification._id} updated successfully`);
    }
  }
}

async function updateunsentNotifications() {
  const unsentNotifications = await UnsentNotification.find({});

  for (let notification of unsentNotifications) {
    let updated = false;

    if (
      notification?.image?.includes('http://www.izone5_api.ihubconnect.com')
    ) {
      notification.image = notification.image.replace(
        'http://www.izone5_api.ihubconnect.com',
        ''
      );
      updated = true;
    }

    if (updated) {
      await notification.save();
      console.log(`Notification ${notification._id} updated successfully`);
    }
  }
}

async function updateComment() {
  const comments = await Comment.find({}).lean();

  const updateTasks = comments.map(async (comment) => {
    let updated = false;

    if (
      comment?.user &&
      comment.user.avatar &&
      comment.user.avatar.includes('http://www.izone5_api.ihubconnect.com')
    ) {
      comment.user.avatar = comment.user.avatar.replace(
        'http://www.izone5_api.ihubconnect.com',
        ''
      );
      updated = true;
    }

    if (updated) {
      await Comment.updateOne({ _id: comment._id }, comment);
      console.log(`Comment ${comment._id} updated successfully`);
    }
  });

  await Promise.all(updateTasks);
}

async function updatePost() {
  const posts = await Post.find({}).lean();

  const updateTasks = posts.map(async (post) => {
    let updated = false;

    if (
      post?.picture ||
      (post?.user &&
        post.user.avatar &&
        post.user.avatar.includes('http://www.izone5_api.ihubconnect.com'))
    ) {
      post.user.avatar = post.user.avatar.replace(
        'http://www.izone5_api.ihubconnect.com',
        ''
      );
      post.picture = post.picture.replace(
        'http://www.izone5_api.ihubconnect.com',
        ''
      );

      updated = true;
    }

    if (updated) {
      await Post.updateOne({ _id: post._id }, post);
      console.log(`Post ${post._id} updated successfully`);
    }
  });

  await Promise.all(updateTasks);
}

async function updateDocument() {
  const documents = await Document.find({}).lean();

  const updateTasks = documents.map(async (document) => {
    let updated = false;

    if (document?.files && Array.isArray(document.files)) {
      document.files = document.files.map((fileObj) => {
        if (
          fileObj.file &&
          fileObj.file.includes('http://www.izone5_api.ihubconnect.com')
        ) {
          fileObj.file = fileObj.file.replace(
            'http://www.izone5_api.ihubconnect.com',
            ''
          );
          updated = true;
        }
        return fileObj;
      });
    }

    if (updated) {
      await Document.updateOne({ _id: document._id }, document);
      console.log(`Document ${document._id} updated successfully`);
    }
  });

  await Promise.all(updateTasks);
}

  async function updateTasks() {
  console.log('setting tasks');
  const tasks = await Task.find({});
  for (let task of tasks) {
    task.title = task.task;
    task.save();
  }
}


module.exports = app;