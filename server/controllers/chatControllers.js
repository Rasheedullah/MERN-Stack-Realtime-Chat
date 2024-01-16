import Chat from '../models/chatModel.js';
import user from '../models/userModel.js';
import Message from '../models/messageModel.js';

export const accessChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) res.send({ message: "Provide User's Id" });
  let chatExists = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.rootUserId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');
  chatExists = await user.populate(chatExists, {
    path: 'latestMessage.sender',
    select: 'name email profilePic',
  });
  if (chatExists.length > 0) {
    res.status(200).send(chatExists[0]);
  } else {
    let data = {
      chatName: 'sender',
      users: [userId, req.rootUserId],
      isGroup: false,
    };
    try {
      const newChat = await Chat.create(data);
      const chat = await Chat.find({ _id: newChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};
export const fetchAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.rootUserId } },
    })
      .populate('users')
      .populate('latestMessage')
      .populate('groupAdmin')
      .sort({ updatedAt: -1 });
    const finalChats = await user.populate(chats, {
      path: 'latestMessage.sender',
      select: 'name email profilePic',
    });
    res.status(200).json(finalChats);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
export const creatGroup = async (req, res) => {
  const { chatName, users } = req.body;
  if (!chatName || !users) {
    res.status(400).json({ message: 'Please fill the fields' });
  }
  const parsedUsers = JSON.parse(users);
  if (parsedUsers.length < 2)
    res.send(400).send('Group should contain more than 2 users');
  parsedUsers.push(req.rootUser);
  try {
    const joiningDates = parsedUsers.map(user => ({
      user: user,
      date: Date.now(),
    }));

    const chat = await Chat.create({
      chatName: chatName,
      users: parsedUsers,
      isGroup: true,
      groupAdmin: req.rootUserId,
      joiningDate:joiningDates
    });
    const createdChat = await Chat.findOne({ _id: chat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    // res.status(200).json(createdChat);
    res.send(createdChat);
  } catch (error) {
    res.sendStatus(500);
  }
};
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName)
    res.status(400).send('Provide Chat id and Chat name');
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $set: { chatName },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');
    if (!chat) res.status(404);
    res.status(200).send(chat);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
export const sendMessage = async (sender, message, chatId) => {
  // const { chatId, message } = req.body;
  try {
    let msg = await Message.create({ sender, message, chatId });
    return msg;
  } catch(error){
  console.log(error)
  }
};

export const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const existing = await Chat.findOne({ _id: chatId });
  if (!existing.users.includes(userId)) {
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $push: { users: userId,
        joiningDate: {
          user: userId
        },
      },
    })
      .populate('groupAdmin', '-password')
      .populate('users', '-password');
    if (!chat) res.status(404);
    const msgRes = await sendMessage(userId, 'has joined the group.', chatId );
    const lastmsg =  await Chat.findByIdAndUpdate(chatId, {
      latestMessage: msgRes,
    });
    if (!msgRes) res.status(404);
    const userdata = await user.findOne({ _id: userId });
    res.status(200).send({chat:chat, user:userdata});
  } else {
    res.status(409).send('user already exists');
  }
};
export const removeFromGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const existing = await Chat.findOne({ _id: chatId });
  if (existing?.users.includes(userId)) {
    Chat.findByIdAndUpdate(chatId, {
      $pull: { users: userId,
        joiningDate: { user: userId }
      }
    })
      .populate('groupAdmin', '-password')
      .populate('users', '-password')
      .then(async(e) => {
      const msgRes = await sendMessage(userId, 'has left the group.', chatId );
      const lastmsg =  await Chat.findByIdAndUpdate(chatId, {
        latestMessage: msgRes,
      });
      res.status(200).send(e)
    })
      .catch((e) => res.status(404));
  } else {
    res.status(409).send('user doesnt exists');
  }
};

export const getNewGroups = async (req, res)=> {
  // console.log(req.rootUserId)
  try {
    const chats = await Chat.find({
      users: { $not: { $elemMatch: { $eq: req.rootUserId } } },
      isGroup: true,
    })
      .populate('users')
      .sort({ updatedAt: -1 });
      res.status(200).json(chats);
  } catch(error){
    res.status(409).send('Somthing Wrong!');
  }
}
// export const removeContact = async (req, res) => {};
