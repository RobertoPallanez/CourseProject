import express from "express";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcryptjs";
import { Sequelize, DataTypes, Op } from "sequelize";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import pkg from "jsonwebtoken";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const sequelize = new Sequelize(
  process.env.RENDERDB_NAME,
  process.env.RENDERDB_USER,
  process.env.RENDERDB_PASSWORD,
  {
    host: process.env.RENDERDB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const corsOptions = {
  origin: [
    "http://localhost:5174", // local dev URL
    "https://reactiveformscourseproject.netlify.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();
app.use(express.json({ limit: "50mb" }));

const Question = sequelize.define(
  "Question",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "templates",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    question_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["short answer", "paragraph", "checkbox", "numeric answer"]],
      },
    },
    options: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "questions",
    timestamps: false,
  }
);

const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "templates",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tag: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "tags",
    timestamps: false,
  }
);

const Template = sequelize.define(
  "Template",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    author_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    topic: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    readOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_update: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "templates",
    timestamps: false,
  }
);

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "user",
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

const Answer = sequelize.define(
  "Answer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "questions",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    answer_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    answer_numeric: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "templates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "forms",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "answers",
    timestamps: false,
  }
);

const Form = sequelize.define(
  "Form",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "templates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    submission_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "forms",
    timestamps: false,
  }
);

app.post("/Register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingEmail = await User.findOne({
    where: { email: email },
  });

  if (!existingEmail) {
    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await User.findOne({
      where: { email: email },
    });

    const token = jwt.sign({ id: user.dataValues.id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    console.log(`user response to send: ${user.dataValues.name}`);
    res
      .status(200)
      .json({ message: "User registered successfully.", user, token });
  } else {
    console.log(`user email already taken.`);
    res.status(200).json({ message: "User email already taken." });
  }
});

app.post("/Login", async (req, res) => {
  const userEmail = req.body.email;
  const password = req.body.password;

  if (!userEmail || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password. " });
  }

  try {
    const user = await User.findOne({
      where: { email: userEmail },
    });

    if (user) {
      const passwordMatch = await bcrypt.compare(
        password,
        user.dataValues.password
      );

      if (user.dataValues.status == "active") {
        if (passwordMatch) {
          const token = jwt.sign(
            { id: user.dataValues.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          if (user.dataValues.role == "admin") {
            const userTemplates = await Template.findAll({
              order: [["last_update", "DESC"]],
            });

            res.status(200).json({
              message: "admin Login successful.",
              user: user.dataValues,
              userTemplates,
              token,
            });
          } else if (user.dataValues.role == "user") {
            const userTemplates = await Template.findAll({
              where: { author_id: user.dataValues.id },
              order: [["last_update", "DESC"]],
            });
            res.status(200).json({
              message: "Login successful.",
              user: user.dataValues,
              userTemplates,
              token,
            });
          } else {
            res.status(401).json({ message: "Invalid email or password" });
          }
        } else {
          res.status(401).json({ message: "Invalid email or password" });
        }
      } else {
        res
          .status(401)
          .json({ message: "User blocked. Please contact your supervisor." });
      }
    } else {
      res
        .status(401)
        .json({ message: "User blocked. Please contact your supervisor." });
    }
  } catch (error) {
    console.error("Error querying database", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

const autenthicateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

app.get("/auth", autenthicateToken, (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});

app.post("/addTemplate", async (req, res) => {
  const {
    name,
    description,
    authorId,
    authorName,
    topic,
    questions,
    role,
    tags,
    image,
    readOnly,
  } = req.body;

  try {
    let imageUrl = null;

    if (image) {
      const trimmedImage = image.trim();
      if (!trimmedImage.startsWith("data:image/")) {
        throw new Error("Invalid image data formatz");
      }

      if (!image.startsWith("data:image/")) {
        throw new Error("Invalid image data format");
      }

      const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

      // Decode the base64 image
      const buffer = Buffer.from(base64Image, "base64");

      const mimeTypeMatch = image.match(/^data:image\/(\w+);base64,/);
      if (!mimeTypeMatch) {
        throw new Error("Could not extract MIME type from image data");
      }

      const mimeType = mimeTypeMatch[1];

      if (!mimeType) {
        throw new Error("Invalid MIME type for image");
      }

      const extension = mimeType === "jpeg" ? "jpg" : mimeType;
      const tempFilePath = path.join(__dirname, `temp-image.${extension}`);
      fs.writeFileSync(tempFilePath, buffer);

      // Upload the file to Cloudinary
      imageUrl = await cloudinary.uploader
        .upload(tempFilePath, {
          folder: "template_images",
          transformation: [
            { width: 400, height: 400, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        })
        .then((result) => {
          console.log("Image uploaded successfully. URL:", result.secure_url);
          return result.secure_url;
        })
        .catch((error) => {
          console.error("Error uploading image to Cloudinary:", error);
          throw error;
        });

      // Delete the temporary file after upload
      fs.unlinkSync(tempFilePath);
    } else {
      console.log("No image data received.");
    }

    console.log("Creating template with image URL:", imageUrl);

    const newTemplate = await Template.create({
      name,
      description,
      author_id: authorId,
      author_name: authorName,
      topic,
      image_url: imageUrl,
      readOnly,
    });

    const newTemplateId = newTemplate.id;

    for (const question of questions) {
      await Question.create({
        template_id: newTemplateId,
        question_text: question.text,
        question_type: question.type,
        options: question.checkboxes,
      });
    }

    for (const tag of tags) {
      await Tag.create({
        template_id: newTemplateId,
        tag,
        user_id: authorId,
      });
    }

    const userTemplates =
      role === "admin"
        ? await Template.findAll()
        : await Template.findAll({
            where: { author_id: authorId },
            order: [["last_update", "DESC"]],
          });

    res.status(200).json({
      message: "Template added successfully.",
      userTemplates,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      message: "Failed to process the request.",
    });
  }
});

app.post("/selectTemplate", async (req, res) => {
  const selectedId = req.body.id;
  const userId = req.body.userId;
  try {
    const template = (
      await Template.findAll({
        where: { id: selectedId },
      })
    )[0];
    const templateName = template.dataValues.name;

    const questions = await Question.findAll({
      where: { template_id: selectedId },
      order: [["order", "ASC"]],
    });

    const tags = await Tag.findAll({
      where: { template_id: selectedId },
    });

    const existingForm = await Form.findOne({
      where: { user_id: userId, template_id: selectedId },
    });

    const existingAnswers = existingForm
      ? await Answer.findAll({
          where: { form_id: existingForm.id },
        })
      : null;

    res.status(200).json({
      message: "Template selected successfully.",
      template: { name: templateName, ...template.dataValues },
      questions,
      tags,
      existingForm,
      existingAnswers,
    });
  } catch (error) {
    console.log("Could not find the template to select it.", error);
    res.status(500).json({
      message: "Could not find the template to select it.",
    });
  }
});

app.get("/allTemplates", async (req, res) => {
  try {
    const templates = await Template.findAll({
      order: [["last_update", "DESC"]],
    });
    const tags = await Tag.findAll();
    res.status(200).json({
      message: "all templates selected successfully.",
      templates,
      tags,
    });
  } catch (error) {
    console.log("Could not retrieve all templates from server.", error);
    res.status(500).json({
      message: "Could not retrieve all templates from server.",
    });
  }
});

app.post("/userTemplates", async (req, res) => {
  const userId = req.body.currentUserId;
  try {
    const templates = await Template.findAll({
      where: { author_id: userId },
      order: [["last_update", "DESC"]],
    });

    const tags = await Tag.findAll({
      where: { template_id: userId },
    });

    res.status(200).json({
      message: "all templates selected successfully.",
      templates,
      tags,
    });
  } catch (error) {
    console.log("Could not retrieve user templates from server.", error);
    res.status(500).json({
      message: "Could not retrieve user templates from server.",
    });
  }
});

app.post("/searchUserTemplates", async (req, res) => {
  const search = req.body.search;
  const user = req.body.user;

  try {
    let matchedTemplates = [];
    const seenIds = new Set();

    const templatesByName = await Template.findAll({
      where: {
        name: { [Op.iLike]: `%${search}%` },
        order: [["last_update", "DESC"]],
      },
    });

    const tags = await Tag.findAll({
      where: {
        tag: { [Op.iLike]: `%${search}%` },
        order: [["last_update", "DESC"]],
      },
    });

    const templatesByTag = await Template.findAll({
      where: {
        id: tags.map((tag) => tag.template_id),
        order: [["last_update", "DESC"]],
      },
    });

    const templatesByTopic = await Template.findAll({
      where: {
        topic: { [Op.iLike]: `%${search}%` },
        order: [["last_update", "DESC"]],
      },
    });

    const templatesByAuthor = await Template.findAll({
      where: {
        author_name: { [Op.iLike]: `%${search}%` },
        order: [["last_update", "DESC"]],
      },
    });

    const allTemplates = [
      ...templatesByName,
      ...templatesByTag,
      ...templatesByTopic,
      ...templatesByAuthor,
    ];

    matchedTemplates = allTemplates.filter((template) => {
      if (!seenIds.has(template.id)) {
        seenIds.add(template.id);
        return true;
      }
      return false;
    });

    if (user.role == "user") {
      matchedTemplates = matchedTemplates.filter(
        (template) => template.author_id == user.id
      );
    }

    res.status(200).json({
      message: "templates filtered successfully.",
      matchedTemplates,
    });
  } catch (error) {
    console.log("Could not find any matching templates from server.", error);
    res.status(500).json({
      message: "Could not find any matching templates from server.",
    });
  }
});

app.post("/searchPublicTemplates", async (req, res) => {
  const search = req.body.search;
  const user = req.body.user;

  try {
    let matchedTemplates = [];
    const seenIds = new Set();

    const templatesByName = await Template.findAll({
      where: {
        name: { [Op.iLike]: `%${search}%` },
      },
    });

    const tags = await Tag.findAll({
      where: {
        tag: { [Op.iLike]: `%${search}%` },
      },
    });

    const templatesByTag = await Template.findAll({
      where: {
        id: tags.map((tag) => tag.template_id),
      },
    });

    const templatesByTopic = await Template.findAll({
      where: {
        topic: { [Op.iLike]: `%${search}%` },
      },
    });

    const templatesByAuthor = await Template.findAll({
      where: {
        author_name: { [Op.iLike]: `%${search}%` },
      },
    });

    const allTemplates = [
      ...templatesByName,
      ...templatesByTag,
      ...templatesByTopic,
      ...templatesByAuthor,
    ];

    matchedTemplates = allTemplates.filter((template) => {
      if (!seenIds.has(template.id)) {
        seenIds.add(template.id);
        return true;
      }
      return false;
    });

    res.status(200).json({
      message: "templates filtered successfully.",
      matchedTemplates,
    });
  } catch (error) {
    console.log("Could not find any matching templates from server.", error);
    res.status(500).json({
      message: "Could not find any matching templates from server.",
    });
  }
});

app.post("/searchUsers", async (req, res) => {
  const search = req.body.search;
  try {
    let matchedUsers = [];
    const seenIds = new Set();

    const usersByName = await User.findAll({
      where: {
        name: { [Op.iLike]: `%${search}%` },
      },
    });

    const usersByEmail = await User.findAll({
      where: {
        email: { [Op.iLike]: `%${search}%` },
      },
    });

    const usersByRole = await User.findAll({
      where: {
        role: { [Op.iLike]: `%${search}%` },
      },
    });

    const usersByStatus = await User.findAll({
      where: {
        status: { [Op.iLike]: `%${search}%` },
      },
    });

    const allUsers = [
      ...usersByName,
      ...usersByEmail,
      ...usersByRole,
      ...usersByStatus,
    ];

    matchedUsers = allUsers.filter((user) => {
      if (!seenIds.has(user.id)) {
        seenIds.add(user.id);
        return true;
      }
      return false;
    });

    res.status(200).json({
      message: "users filtered successfully.",
      matchedUsers,
    });
  } catch (error) {
    console.log("Could not find any matching users from server.", error);
    res.status(500).json({
      message: "Could not find any matching users from server.",
    });
  }
});

app.get("/allUsers", async (req, res) => {
  try {
    const users = await User.findAll({
      where: { id: { [Op.not]: 44 } },
    });
    res.status(200).json({ message: "all users sent successfully.", users });
  } catch (error) {
    console.log("Could not retrieve all users from server.", error);
    res.status(500).json({
      message: "Could not retrieve all users from server.",
    });
  }
});

app.post("/deleteTemplate", async (req, res) => {
  const idToDelete = req.body.idToDelete;
  const authorId = req.body.authorId;

  const user = await User.findOne({
    where: { id: authorId },
  });

  try {
    // await Question.destroy({
    //   where: { template_id: idToDelete },
    // });

    await Template.destroy({
      where: { id: idToDelete },
    });

    if (user.role == "admin") {
      const userTemplates = await Template.findAll();
      res.status(200).json({
        message: "all Forms received sucessfully.",
        userTemplates,
        user,
      });
    } else {
      const userTemplates = await Template.findAll({
        where: { author_id: authorId },
      });
      res.status(200).json({
        message: "user Forms received sucessfully.",
        userTemplates,
        user,
      });
    }
  } catch (error) {
    console.log(
      "This user has no templates or there is an error receiving them from server",
      error
    );
    res.status(500).json({
      message: "no templates from user or error receiving them from server.",
    });
  }
});

app.put("/updateTemplate", async (req, res) => {
  const updates = req.body.updatedQuestions; // Array of questions with updated order and text
  const updatedName = req.body.updatedName;
  const updatedDescription = req.body.updatedDescription;
  const templateId = Number(req.body.templateId);
  const questionsToDelete = req.body.deletedQuestions;
  const tagsToDelete = req.body.deletedTags;
  const lastUpdate = new Date().toISOString();

  try {
    const template = await Template.findOne({
      where: { id: templateId },
    });

    if (template) {
      template.name = updatedName;
      template.description = updatedDescription;
      template.last_update = lastUpdate;
      await template.save();
    }

    for (const [index, update] of updates.entries()) {
      const question = await Question.findOne({
        where: { id: update.id },
      });

      if (question) {
        question.question_text = update.question_text;
        question.order = index + 1;
        await question.save();
      }
    }

    if (questionsToDelete && questionsToDelete.length > 0) {
      await Question.destroy({
        where: { id: questionsToDelete },
      });
    }

    const remainingQuestions = await Question.findAll({
      where: { template_id: templateId },
      order: [["order", "ASC"]],
    });

    if (tagsToDelete && tagsToDelete.length > 0) {
      await Tag.destroy({
        where: { id: tagsToDelete },
      });
    }

    const remainingTags = await Tag.findAll({
      where: { template_id: templateId },
    });

    res.status(200).json({
      message: "Template updated successfully.",
      remainingQuestions,
      remainingTags,
    });
  } catch (err) {
    console.error("Error updating template:", err);
    res.status(500).json({
      error: "An error occurred while updating the template.",
    });
  }
});

app.put("/updateForm", async (req, res) => {
  const updates = req.body.updatedAnswers;

  try {
    for (const update of updates) {
      if (update.id) {
        // Existing answer: Update it
        const answer = await Answer.findOne({
          where: { id: update.id },
        });

        if (answer) {
          answer.answer_text = update.answer_text;
          answer.answer_numeric = update.answer_numeric;
          await answer.save();
        }
      } else {
        // New answer: Create it
        await Answer.create({
          question_id: update.question_id,
          user_id: update.user_id,
          answer_text: update.answer_text,
          answer_numeric: update.answer_numeric,
          template_id: update.template_id,
          form_id: update.form_id,
        });
      }
    }

    res.status(200).json({
      message: "Form updated successfully.",
    });
  } catch (err) {
    console.error("Error updating form:", err);
    res.status(500).json({
      error: "An error occurred while updating the form.",
    });
  }
});

app.post("/deleteQuestion", async (req, res) => {
  const idToDelete = req.body.questionId;
  const templateId = req.body.selectedTemplateId;

  try {
    await db.query("DELETE FROM questions WHERE id = $1", [idToDelete]);

    const response = await db.query(
      "SELECT * FROM questions WHERE template_id = $2",
      [templateId]
    );
    const remainingQuestions = response.rows;

    res
      .status(200)
      .json({ message: "question deleted successfuly." }, remainingQuestions);
  } catch (err) {
    res.status(500).json({
      error: "An error ocurred while deleting the question",
    });
  }
});

app.post("/addQuestion", async (req, res) => {
  const qText = req.body.questionToAdd.text;
  const qType = req.body.questionToAdd.type;
  const qOptions = req.body.questionToAdd.checkboxes;
  const templateId = req.body.templateId;

  try {
    await Question.create({
      question_text: qText,
      question_type: qType,
      options: qOptions,
      template_id: templateId,
    });

    const questions = await Question.findAll({
      where: { template_id: templateId },
      order: [["created_at", "ASC"]],
    });

    res
      .status(200)
      .json({ message: "user templates received sucessfully.", questions });
  } catch (error) {
    console.log("Error adding the question to the database", error);
    res.status(500).json({
      message: "Error adding this question to the server",
    });
  }
});

app.post("/addTag", async (req, res) => {
  const tag = req.body.tagToAdd;
  const templateId = req.body.templateId;
  const userId = req.body.userId;

  try {
    await Tag.create({
      tag: tag,
      template_id: templateId,
      user_id: userId,
    });

    const tags = await Tag.findAll({
      where: { template_id: templateId },
      order: [["id", "ASC"]],
    });

    res.status(200).json({ message: "tag added successfully.", tags });
  } catch (error) {
    console.log("Error adding the tag to the database", error);
    res.status(500).json({
      message: "Error adding this tag to the server",
    });
  }
});

app.post("/submitAnswers", async (req, res) => {
  const answers = req.body.answersToSubmit; //array with the anwers

  try {
    const newForm = await Form.create({
      user_id: answers[0].userId,
      user_name: answers[0].userName,
      user_email: answers[0].userEmail,
      template_id: answers[0].templateId,
    });

    const newFormId = newForm.id;

    for (const answer of answers) {
      const newAnswer = await Answer.create({
        question_id: answer.questionId,
        user_id: answer.userId,
        answer_text: answer.answerText,
        answer_numeric: answer.answerNumeric,
        template_id: answer.templateId,
        form_id: newFormId,
      });
    }

    console.log(`new answers submitted.`);
    res.status(200).json({ message: "answers submitted successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error ocurred while submitting the answers." });
  }
});

app.post("/getForms", async (req, res) => {
  const templateId = req.body.templateId;

  try {
    const forms = await Form.findAll({
      where: { template_id: templateId },
    });

    console.log(
      `form submissions sent. forms retreived: ${forms.length}. first form id: ${forms[0].id} `
    );
    res.status(200).json({
      message: "form submissions sent successfully.",
      forms,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error ocurred while submitting the answers." });
  }
});

app.post("/selectForm", async (req, res) => {
  const formId = req.body.formId;

  try {
    const form = await Form.findOne({
      where: { id: formId },
    });

    const answers = await Answer.findAll({
      where: { form_id: formId },
    });

    const templateId = answers[0].template_id;

    const questions = await Question.findAll({
      where: { template_id: templateId },
      order: [["order", "ASC"]],
    });

    const questionIdOrder = questions.map((q) => q.id);

    const sortedAnswers = answers.sort(
      (a, b) =>
        questionIdOrder.indexOf(a.question_id) -
        questionIdOrder.indexOf(b.question_id)
    );

    res.status(200).json({
      message: "form submissions sent successfully.",
      form,
      sortedAnswers,
      questions,
    });
  } catch (err) {
    res.status(500).json({
      error: "An error ocurred while searching for the form and answers.",
    });
  }
});

app.post("/promoteToAdmin", async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    user.role = "admin";
    await user.save();

    res.status(200).json({
      message: "user promoted to admin successfully.",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: "An error ocurred while promoting user to admin.",
    });
  }
});

app.post("/removeFromAdmins", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    user.role = "user";
    await user.save();

    res.status(200).json({
      message: "user removed from admins successfully.",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: "An error ocurred while removing user from admins.",
    });
  }
});

app.post("/blockOrUnblockUser", async (req, res) => {
  const userId = req.body.id;

  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (user.status == "active") {
      user.status = "blocked";
    } else if (user.status == "blocked") {
      user.status = "active";
    }
    await user.save();

    res.status(200).json({
      message: "user blocked/unblocked successfully.",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: "An error ocurred while removing user from admins.",
    });
  }
});

app.post("/deleteUser", async (req, res) => {
  const userId = req.body.id;

  try {
    const templates = await Template.destroy({
      where: { author_id: userId },
    });

    const user = await User.destroy({
      where: { id: userId },
    });

    res.status(200).json({
      message: "user deleted successfully.",
      user,
    });
  } catch (err) {
    res.status(500).json({
      error: "An error ocurred while deleting the user.",
    });
  }
});

app.post("/getTemplateData", async (req, res) => {
  const selectedId = req.body.templateId;
  try {
    const template = (
      await Template.findAll({
        where: { id: selectedId },
      })
    )[0];

    const forms = await Form.findAll({
      where: { template_id: selectedId },
    });

    const questions = await Question.findAll({
      where: { template_id: selectedId },
      order: [["order", "ASC"]],
    });

    const answers = await Answer.findAll({
      where: { template_id: selectedId },
    });

    res.status(200).json({
      message: "Template selected successfully.",
      template,
      forms,
      questions,
      answers,
    });
  } catch (error) {
    console.log("Could not find the data for the selected template.", error);
    res.status(500).json({
      message: "Could not find the data for the selected template.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

export default sequelize;
