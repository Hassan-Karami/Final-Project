const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },

    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 30,
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid password. Password must have at least 8 characters containing at least 1 letter and 1 digit.`,
      },
    },
    avatar:{type:String},

    phone_number: 
      {
        unique: true,
        type: String,
        required: true,
        validate: /^(\+98|0)?9\d{9}$/,
      },
    
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "not_set"],
      default: "not_set",
    },
    role: {
      type: String,
      required: false,
      enum: ["blogger", "admin"],
      default: "blogger",
    },
    
  },
  {
    timestamps: {
      createdAt: "registration_date",
      
    },
    toJSON: {
          virtuals: true,
        },
        toObject: {
                  virtuals: true,
                },
  }
);
UserSchema.virtual("articles",{
  ref: "Article",
    localField: "_id",
    foreignField: "author",
})

UserSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});

UserSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    next(err);
  }
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  try {
    // check if the password field is being updated
    if (this._update.password) {
      const salt = await bcrypt.genSalt(10);
      this._update.password = await bcrypt.hash(this._update.password, salt);
    }

    return next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

// create default admin
(async (next) => {
    try {
        const User = mongoose.model('User',UserSchema);
        // const adminUser = await User.countDocuments({});
        const adminUser = await User.findOne({role:'admin'})
        // console.log(adminUser)
        if (!adminUser) {
            const admin = new User({
              firstName: "admin",
              lastName: "admin",
              username: "admin",
              password: "admin123",
              gender: "male",
              avatar: "/images/defaultProfileImage.png",
              phone_number: "+989110000000",
              role: "admin",
            });
            await admin.save();
            console.log('Default admin user created.');
        } else {
        console.log('Admin user already exists.');
        }
    } catch (err) {
        next(err)
    }
})()

module.exports = mongoose.model("User", UserSchema);
