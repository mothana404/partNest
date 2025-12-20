const { User, Student, Company } = require("../../models/associations");
const { sequelize } = require("../config/database");
const ApiResponse = require("../utils/response");
const { generateToken } = require("../services/jwt");
const bcrypt = require("bcrypt");

const authController = {
  companySignUp: async (req, res) => {
    try {
      const {
        email,
        password,
        fullName,
        phoneNumber,
        companyName,
        industry,
        description,
        website,
        size,
        address,
        foundedYear,
      } = req.body;

      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return ApiResponse.errorResponse(res, 409, "Email already registered");
      }

      const existingCompany = await Company.findOne({
        where: { companyName },
      });

      if (existingCompany) {
        return ApiResponse.errorResponse(res, 409, "Company name already taken");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await sequelize.transaction(async (transaction) => {
        const user = await User.create({
          email: email.toLowerCase(),
          password: hashedPassword,
          fullName,
          phoneNumber: phoneNumber || null,
          role: "COMPANY",
          isActive: true,
          isVerified: false,
        }, { transaction });

        const company = await Company.create({
          userId: user.user_id,
          companyName,
          industry: industry || null,
          description: description || null,
          website: website || null,
          size: size || null,
          address: address || null,
          contactEmail: email.toLowerCase(),
          contactPhone: phoneNumber || null,
          isVerified: false,
          foundedYear: foundedYear || null,
        }, { transaction });

        return { user, company };
      });

      const payload = {
        userId: result.user.user_id,
        role: result.user.role,
      };

      const accessToken = generateToken(payload);

      const responseData = {
        user: {
          user_id: result.user.user_id,
          email: result.user.email,
          fullName: result.user.fullName,
          phoneNumber: result.user.phoneNumber,
          role: result.user.role,
          isActive: result.user.isActive,
          isVerified: result.user.isVerified,
        },
        company: {
          id: result.company.id,
          companyName: result.company.companyName,
          industry: result.company.industry,
          description: result.company.description,
          website: result.company.website,
          size: result.company.size,
          address: result.company.address,
          isVerified: result.company.isVerified,
          foundedYear: result.company.foundedYear,
        },
        accessToken,
      };

      return ApiResponse.successResponse(
        res,
        201,
        "registered successfully",
        responseData
      );
    } catch (error) {
      console.error("Company signup error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to register");
    }
  },

  studentSignUp: async (req, res) => {
    try {
      const {
        email,
        password,
        fullName,
        phoneNumber,
        university,
        major,
        year,
        gpa,
        age,
        about,
        cvLink
      } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return ApiResponse.errorResponse(res, 409, "Email already registered");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Use Sequelize transaction
      const result = await sequelize.transaction(async (transaction) => {
        const user = await User.create({
          email: email.toLowerCase(),
          password: hashedPassword,
          fullName,
          phoneNumber: phoneNumber || null,
          role: "STUDENT",
          isActive: true,
          isVerified: false,
        }, { transaction });

        const student = await Student.create({
          userId: user.user_id,
          university,
          major: major || null,
          year: year || null,
          gpa: gpa || null,
          age: age || null,
          about: about || null,
          cvLink: cvLink || null,
        }, { transaction });

        return { user, student };
      });

      const payload = {
        userId: result.user.user_id,
        role: result.user.role,
      };

      const accessToken = generateToken(payload);

      const responseData = {
        user: {
          user_id: result.user.user_id,
          email: result.user.email,
          fullName: result.user.fullName,
          phoneNumber: result.user.phoneNumber,
          role: result.user.role,
          isActive: result.user.isActive,
          isVerified: result.user.isVerified,
        },
        student: {
          id: result.student.id,
          university: result.student.university,
          major: result.student.major,
          year: result.student.year,
          gpa: result.student.gpa,
          age: result.student.age,
          about: result.student.about,
          cvLink: result.student.cvLink,
        },
        accessToken,
      };

      return ApiResponse.successResponse(
        res,
        201,
        "registered successfully",
        responseData
      );
    } catch (error) {
      console.error("Student signup error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to register");
    }
  },

  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user with associated company and student data
      const user = await User.findOne({
        where: { email: email.toLowerCase() },
        include: [
          {
            model: Company,
            as: 'company',
            required: false
          },
          {
            model: Student,
            as: 'student',
            required: false
          }
        ]
      });

      if (!user) {
        return ApiResponse.errorResponse(res, 401, "Invalid email or password");
      }

      if (!user.isActive) {
        return ApiResponse.errorResponse(
          res,
          403,
          "Your account has been deactivated. Please contact support."
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return ApiResponse.errorResponse(res, 401, "Invalid email or password");
      }

      // Update last login
      await User.update(
        { lastLogin: new Date() },
        { where: { user_id: user.user_id } }
      );

      const payload = {
        userId: user.user_id,
        role: user.role,
      };

      const accessToken = generateToken(payload);

      const responseData = {
        user: {
          user_id: user.user_id,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
        },
        company: user.company || null,
        student: user.student || null,
        accessToken,
      };

      return ApiResponse.successResponse(res, 200, "Login successful", responseData);
    } catch (error) {
      console.error("User login error:", error);
      return ApiResponse.errorResponse(
        res,
        500,
        "Login failed. Please try again."
      );
    }
  },

  createAdmin: async (req, res) => {
    try {
      const {
        email,
        password,
        fullName,
        phoneNumber
      } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return ApiResponse.errorResponse(res, 409, "Email already registered");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
        phoneNumber: phoneNumber || null,
        role: "ADMIN",
        isActive: true,
        isVerified: true, // Admin accounts are verified by default
      });

      const payload = {
        userId: user.user_id,
        role: user.role,
      };

      const accessToken = generateToken(payload);

      const responseData = {
        user: {
          user_id: user.user_id,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
        accessToken,
      };

      return ApiResponse.successResponse(
        res,
        201,
        "Admin created successfully",
        responseData
      );
    } catch (error) {
      console.error("Admin creation error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to create admin");
    }
  },

  // Additional helper method to get user profile
  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.user; // From auth middleware

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Company,
            as: 'company',
            required: false
          },
          {
            model: Student,
            as: 'student',
            required: false,
            include: [
              {
                model: User,
                as: 'user',
                include: ['skills', 'experiences', 'links']
              }
            ]
          }
        ],
        attributes: { exclude: ['password'] } // Don't return password
      });

      if (!user) {
        return ApiResponse.errorResponse(res, 404, "User not found");
      }

      const responseData = {
        user: {
          user_id: user.user_id,
          email: user.email,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          location: user.location,
          image: user.image,
          background: user.background,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        company: user.company || null,
        student: user.student || null,
      };

      return ApiResponse.successResponse(res, 200, "Profile retrieved successfully", responseData);
    } catch (error) {
      console.error("Get profile error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to get profile");
    }
  }
};

module.exports = authController;