import Message from '../models/messageModel.js';
import user from '../models/userModel.js';
import Chat from '../models/chatModel.js';
export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;
  try {
    let msg = await Message.create({ sender: req.rootUserId, message, chatId });
    msg = await (
      await msg.populate('sender', 'name profilePic email')
    ).populate({
      path: 'chatId',
      select: 'chatName isGroup users',
      model: 'Chat',
      populate: {
        path: 'users',
        select: 'name email profilePic',
        model: 'User',
      },
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: msg,
    });
    res.status(200).send(msg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'name profilePic email',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      });

    res.status(200).json(messages);
  } catch (error) {
    res.sendStatus(500).json({ error: error });
    console.log(error);
  }
};

export const getGroupMessages = async (req, res) => {
  const { chatId } = req.params;
  // const { userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    const userJoiningDate = chat.joiningDate.find(entry => entry.user.equals(req.rootUserId))?.date;

    
    const lastMessages = await Message.find({
      chatId,
      createdAt: { $lt: userJoiningDate },
    })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'name profilePic email',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      })
      .sort({ createdAt: -1 }) 
      .limit(10);

    const allMessages = await Message.find({
      chatId,
      createdAt: { $gte: userJoiningDate },
    })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'name profilePic email',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      })
      .sort({ createdAt: 1 }); 

    const messages = lastMessages.concat(allMessages);

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

