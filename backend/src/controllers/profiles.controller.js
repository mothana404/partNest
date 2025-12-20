const { array } = require("joi");
const { User, Student, Company, Skill, Experience, Link } = require("../../models/associations");
const { sequelize } = require("../config/database");
const ApiResponse = require("../utils/response");

const profilesControllers = {
  companyProfile: async (req, res) => {
    try {
      const userId = req.user.user_id; 

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Company,
            as: 'company',
            required: true
          },
          {
            model: Link,
            as: 'links',
            required: false
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user || !user.company) {
        return ApiResponse.errorResponse(res, 404, "Company profile not found");
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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        company: user.company,
        links: user.links || []
      };

      return ApiResponse.successResponse(res, 200, "Company profile retrieved successfully", responseData);
    } catch (error) {
      console.error("Get company profile error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to get company profile");
    }
  },

  studentProfile: async (req, res) => {
    try {
      const userId = req.user.user_id;

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Student,
            as: 'student',
            required: true
          },
          {
            model: Skill,
            as: 'skills',
            required: false
          },
          {
            model: Experience,
            as: 'experiences',
            required: false,
            order: [['startDate', 'DESC']]
          },
          {
            model: Link,
            as: 'links',
            required: false
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user || !user.student) {
        return ApiResponse.errorResponse(res, 404, "Student profile not found");
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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        student: user.student,
        skills: user.skills || [],
        experiences: user.experiences || [],
        links: user.links || []
      };

      return ApiResponse.successResponse(res, 200, "Student profile retrieved successfully", responseData);
    } catch (error) {
      console.error("Get student profile error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to get student profile");
    }
  },

  adminProfile: async (req, res) => {
    try {
      const userId = req.user.user_id;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return ApiResponse.errorResponse(res, 404, "Admin profile not found");
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
        }
      };

      return ApiResponse.successResponse(res, 200, "Admin profile retrieved successfully", responseData);
    } catch (error) {
      console.error("Get admin profile error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to get admin profile");
    }
  },

  editStudent: async (req, res) => {
  try {
    const userId = req.user.user_id;
    let {
      fullName,
      phoneNumber,
      location,
      background,
      university,
      major,
      year,
      gpa,
      age,
      about,
      cvLink,
      availability,
      preferredJobTypes,
      preferredLocations,
      expectedSalaryMin,
      expectedSalaryMax,
      skills,
      experiences,
      links
    } = req.body;

    // Parse arrays if they're JSON strings (from FormData)
    if (typeof preferredJobTypes === 'string') {
      if (preferredJobTypes.trim() === '') {
        preferredJobTypes = [];
      } else {
        try {
          preferredJobTypes = JSON.parse(preferredJobTypes);
        } catch (e) {
          console.error('Error parsing preferredJobTypes:', e);
          preferredJobTypes = [];
        }
      }
    }

    if (typeof preferredLocations === 'string') {
      if (preferredLocations.trim() === '') {
        preferredLocations = [];
      } else {
        try {
          preferredLocations = JSON.parse(preferredLocations);
        } catch (e) {
          console.error('Error parsing preferredLocations:', e);
          preferredLocations = [];
        }
      }
    }

    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        skills = [];
      }
    }

    if (typeof experiences === 'string') {
      try {
        experiences = JSON.parse(experiences);
      } catch (e) {
        experiences = [];
      }
    }

    if (typeof links === 'string') {
      try {
        links = JSON.parse(links);
      } catch (e) {
        links = [];
      }
    }

    // Parse numeric values that might come as strings from FormData
    if (year !== undefined && year !== null && year !== '') {
      year = typeof year === 'string' ? parseInt(year) : year;
    }
    if (gpa !== undefined && gpa !== null && gpa !== '') {
      gpa = typeof gpa === 'string' ? parseFloat(gpa) : gpa;
    }
    if (age !== undefined && age !== null && age !== '') {
      age = typeof age === 'string' ? parseInt(age) : age;
    }
    if (expectedSalaryMin !== undefined && expectedSalaryMin !== null && expectedSalaryMin !== '') {
      expectedSalaryMin = typeof expectedSalaryMin === 'string' ? parseInt(expectedSalaryMin) : expectedSalaryMin;
    }
    if (expectedSalaryMax !== undefined && expectedSalaryMax !== null && expectedSalaryMax !== '') {
      expectedSalaryMax = typeof expectedSalaryMax === 'string' ? parseInt(expectedSalaryMax) : expectedSalaryMax;
    }
    if (availability !== undefined && typeof availability === 'string') {
      availability = availability === 'true' || availability === true;
    }

    const imageUrl = req.uploadedImage ? req.uploadedImage.url : undefined;

    const result = await sequelize.transaction(async (transaction) => {
      const userUpdateData = {};
      if (fullName !== undefined) userUpdateData.fullName = fullName;
      if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
      if (location !== undefined) userUpdateData.location = location;
      if (background !== undefined) userUpdateData.background = background;
      if (imageUrl) userUpdateData.image = imageUrl;

      if (Object.keys(userUpdateData).length > 0) {
        await User.update(userUpdateData, {
          where: { user_id: userId },
          transaction
        });
      }

      const studentUpdateData = {};
      if (university !== undefined) studentUpdateData.university = university;
      if (major !== undefined) studentUpdateData.major = major;
      if (year !== undefined) studentUpdateData.year = year;
      if (gpa !== undefined) studentUpdateData.gpa = gpa;
      if (age !== undefined) studentUpdateData.age = age;
      if (about !== undefined) studentUpdateData.about = about;
      if (cvLink !== undefined) studentUpdateData.cvLink = cvLink;
      if (availability !== undefined) studentUpdateData.availability = availability;
      
      if (preferredJobTypes !== undefined) {
        // Ensure it's always an array
        if (Array.isArray(preferredJobTypes)) {
          studentUpdateData.preferredJobTypes = preferredJobTypes;
        } else if (preferredJobTypes === null || preferredJobTypes === '') {
          studentUpdateData.preferredJobTypes = [];
        } else {
          // If it's a single value, wrap it in an array
          studentUpdateData.preferredJobTypes = [preferredJobTypes];
        }
      }
      if (preferredLocations !== undefined) {
        // Ensure it's always an array
        if (Array.isArray(preferredLocations)) {
          studentUpdateData.preferredLocations = preferredLocations;
        } else if (preferredLocations === null || preferredLocations === '') {
          studentUpdateData.preferredLocations = [];
        } else {
          // If it's a single value, wrap it in an array
          studentUpdateData.preferredLocations = [preferredLocations];
        }
      }
      
      if (expectedSalaryMin !== undefined) studentUpdateData.expectedSalaryMin = expectedSalaryMin;
      if (expectedSalaryMax !== undefined) studentUpdateData.expectedSalaryMax = expectedSalaryMax;

      if (Object.keys(studentUpdateData).length > 0) {
        await Student.update(studentUpdateData, {
          where: { userId },
          transaction
        });
      }

      if (skills && Array.isArray(skills)) {
        await Skill.destroy({
          where: { userId },
          transaction
        });

        if (skills.length > 0) {
          const skillsData = skills.map(skill => ({
            userId,
            name: skill.name,
            level: skill.level || null,
            yearsOfExp: skill.yearsOfExp || null
          }));
          await Skill.bulkCreate(skillsData, { transaction });
        }
      }

      if (experiences && Array.isArray(experiences)) {
        await Experience.destroy({
          where: { userId },
          transaction
        });

        if (experiences.length > 0) {
          const experiencesData = experiences.map(exp => ({
            userId,
            title: exp.title,
            companyName: exp.companyName || null,
            description: exp.description || null,
            location: exp.location || null,
            employmentType: exp.employmentType || null,
            startDate: exp.startDate,
            endDate: exp.endDate || null,
            isCurrent: exp.isCurrent || false
          }));
          await Experience.bulkCreate(experiencesData, { transaction });
        }
      }

      if (links && Array.isArray(links)) {
        await Link.destroy({
          where: { userId },
          transaction
        });

        if (links.length > 0) {
          const linksData = links.map(link => ({
            userId,
            type: link.type,
            url: link.url,
            label: link.label || null
          }));
          await Link.bulkCreate(linksData, { transaction });
        }
      }

      const updatedUser = await User.findByPk(userId, {
        include: [
          {
            model: Student,
            as: 'student',
            required: true
          },
          {
            model: Skill,
            as: 'skills',
            required: false
          },
          {
            model: Experience,
            as: 'experiences',
            required: false,
            order: [['startDate', 'DESC']]
          },
          {
            model: Link,
            as: 'links',
            required: false
          }
        ],
        attributes: { exclude: ['password'] },
        transaction
      });

      return updatedUser;
    });

    const responseData = {
      user: {
        user_id: result.user_id,
        email: result.email,
        fullName: result.fullName,
        phoneNumber: result.phoneNumber,
        location: result.location,
        image: result.image,
        background: result.background,
        role: result.role,
        isActive: result.isActive,
        isVerified: result.isVerified,
        updatedAt: result.updatedAt,
      },
      student: result.student,
      skills: result.skills || [],
      experiences: result.experiences || [],
      links: result.links || []
    };

    return ApiResponse.successResponse(res, 200, "Student profile updated successfully", responseData);
  } catch (error) {
    console.error("Edit student profile error:", error);
    return ApiResponse.errorResponse(res, 500, "Failed to update student profile");
  }
},

  editCompany: async (req, res) => {
    try {
      const userId = req.user.user_id;
      let {
        fullName,
        phoneNumber,
        location,
        background,
        companyName,
        industry,
        description,
        website,
        size,
        foundedYear,
        contactEmail,
        contactPhone,
        address,
        links
      } = req.body;

      // Parse links if it's a JSON string (from FormData)
      if (typeof links === 'string') {
        try {
          links = JSON.parse(links);
        } catch (e) {
          links = [];
        }
      }

      const imageUrl = req.uploadedImage ? req.uploadedImage.url : undefined;

      const result = await sequelize.transaction(async (transaction) => {
        const userUpdateData = {};
        if (fullName !== undefined) userUpdateData.fullName = fullName;
        if (phoneNumber !== undefined) userUpdateData.phoneNumber = phoneNumber;
        if (location !== undefined) userUpdateData.location = location;
        if (background !== undefined) userUpdateData.background = background;
        if (imageUrl) userUpdateData.image = imageUrl;

        if (Object.keys(userUpdateData).length > 0) {
          await User.update(userUpdateData, {
            where: { user_id: userId },
            transaction
          });
        }

        const companyUpdateData = {};
        if (companyName !== undefined) companyUpdateData.companyName = companyName;
        if (industry !== undefined) companyUpdateData.industry = industry;
        if (description !== undefined) companyUpdateData.description = description;
        if (website !== undefined) companyUpdateData.website = website;
        if (size !== undefined) companyUpdateData.size = size;
        if (foundedYear !== undefined) companyUpdateData.foundedYear = foundedYear;
        if (contactEmail !== undefined) companyUpdateData.contactEmail = contactEmail;
        if (contactPhone !== undefined) companyUpdateData.contactPhone = contactPhone;
        if (address !== undefined) companyUpdateData.address = address;

        if (Object.keys(companyUpdateData).length > 0) {
          await Company.update(companyUpdateData, {
            where: { userId },
            transaction
          });
        }
        
        if (links && Array.isArray(links)) {
          await Link.destroy({
            where: { userId },
            transaction
          });

          if (links.length > 0) {
            const linksData = links.map(link => ({
              userId,
              type: link.type,
              url: link.url,
              label: link.label || null
            }));
            await Link.bulkCreate(linksData, { transaction });
          }
        }

        // Fetch updated user with all associations
        const updatedUser = await User.findByPk(userId, {
          include: [
            {
              model: Company,
              as: 'company',
              required: true
            },
            {
              model: Link,
              as: 'links',
              required: false
            }
          ],
          attributes: { exclude: ['password'] },
          transaction
        });

        return updatedUser;
      });

      const responseData = {
        user: {
          user_id: result.user_id,
          email: result.email,
          fullName: result.fullName,
          phoneNumber: result.phoneNumber,
          location: result.location,
          image: result.image,
          background: result.background,
          role: result.role,
          isActive: result.isActive,
          isVerified: result.isVerified,
          updatedAt: result.updatedAt,
        },
        company: result.company,
        links: result.links || []
      };

      return ApiResponse.successResponse(res, 200, "Company profile updated successfully", responseData);
    } catch (error) {
      console.error("Edit company profile error:", error);
      return ApiResponse.errorResponse(res, 500, "Failed to update company profile");
    }
  }
};

module.exports = profilesControllers;