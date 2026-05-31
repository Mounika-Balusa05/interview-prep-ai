const Session = require("../models/Session");
const Question = require("../models/Question");

//@desc create a new session and linked questions
//@route post/api/sessions/create
//@access private

exports.createSession = async(req,res)=>{
    try{
        const {role,experience,topicsToFocus,description,questions}=
        req.body;
        const userId = req.user._id; //assuming you have a middleware setting req.user

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(
            questions.map(async(q)=>{
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                });
                return question._id;
            })
        );

        session.questions=questionDocs;
        await session.save();

        res.status(201).json({success:true,session});
    }catch(error){
        res.status(500).json({sucess:false,message:"Server Error"});
    }
};

//@ desc get all sessions for the logged-in user
// @route get/api/sessions/my-sessions
//@acess private
exports.getMySessions = async(req,res)=>{
    try{
        const sessions=await Session.find({user:req.user.id})
        .sort({createdAt: -1})
        .populate("questions");
        res.status(200).json(sessions);
    }catch(error){
        res.status(500).json({sucess:false,message:"Server Error"});
    }
};

//@desc get a session by id with populated questions
//@route get/api/sessions/:id
//@access private
exports.getSessionById=async(req,res)=>{
    try{
        const session = await Session.findById(req.params.id)
        .populate({
            path: "questions",
            options : {sort: {isPinned: -1,createAt: 1}},
        })
        .exec();

        if(!session){
            return res
            .status(404)
            .json({ducess: false,message: "Session not found"});
        }

        res.status(200).json({sucess: true,session});
    }catch(error){
        res.status(500).json({sucess:false,message:"Server Error"});
    }
};

//@desc delete a session and its questions
//@route delete/api/sessions/:id
//@access private
exports.deleteSession=async(req,res)=>{
    try{
        const session = await Session.findById(req.params.id);

        if(!session){
            return res.status(404).json({message: "Session not found"});
        }

        //check if the logged-in user owns this session
        if(session.user.toString() !== req.user._id.toString()){
            return res
            .status(401)
            .json({message: "Not authorized to delete this session"});
        }

        // first , delete all questions linked to this session
        await Question.deleteMany({session: session._id});

        //then delete the session
        await session.deleteOne();
        // Add this after await session.deleteOne();
res.status(200).json({success: true, message: "Session deleted successfully"});
    }catch(error){
        res.status(500).json({sucess:false,message:"Server Error"});
    }
};
exports.togglePinSession = async(req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if(!session) return res.status(404).json({message: "Session not found"});
        
        session.isPinned = !session.isPinned;
        await session.save();
        
        res.status(200).json({success: true, session});
    } catch(error) {
        res.status(500).json({message: "Server error"});
    }
};