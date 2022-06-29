import User from '../models/userSchema.js';
import Admin from '../models/adminSchema.js';
import fs from 'fs';
import path, { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

var __dirname = path.join(dirname(fileURLToPath(import.meta.url)));


export const dashboard = (req, res) => {
      res.render('dashboard');
}
export const tables = async (req, res) => {

      try {
            const records = await User.find();
            res.status(200).render('tables', { records: records })
      } catch (err) {
            req.flash('error', 'Something went wrong')
            res.status(500).redirect('/admin')
      }

}
export const forms = (req, res) => {
      res.status(200).render('form')
}
export const login = (req, res) => {
      if (req.isAuthenticated()) {
            req.flash('error', 'You have already logged in')
            return res.status(200).redirect('/admin')
      }
      res.status(200).render('login')
}
export const register = (req, res) => {
      if (req.isAuthenticated()) {
            req.flash('error', 'You have to logout first')
            return res.status(200).redirect('/admin')
      }
      res.status(200).render('register')
}
export const errorPage = (req, res) => {
      res.status(404).render('error')
}

export const insertRecord = (req, res) => {
      User.uploadedAvatar(req, res, async (err) => {
            if (err) {
                  req.flash('error', 'File is not uploaded')
                  return false;
            }

            if (req.file) {

                  if (req.body.password != req.body.cpassword) {
                        req.flash('error', 'passwords are not same')
                        return res.redirect('back')
                  }
                  try {
                        var avatarName = User.avatarPath + '/' + req.file.filename
                        var name = req.body.fname.trim() + ' ' + req.body.lname.trim()
                        var trimmedMessage = req.body.message.trim()
                        await User.create({
                              name: name,
                              email: req.body.email,
                              password: req.body.password,
                              gender: req.body.gender,
                              hobby: req.body.hobby,
                              city: req.body.city,
                              message: trimmedMessage,
                              avatar: avatarName,
                        })
                        req.flash('success', 'Record created successfully')
                        res.redirect('/admin/tables')
                  } catch (err) {
                        req.flash('error', 'something went wrong')
                        console.log(err.message)
                  }
            }

      })
}

export const deleteRecord = async (req, res) => {
      try {
            var record = await User.findById(req.params.id)
            var avatar = record.avatar;
            fs.unlinkSync(path.join(__dirname, '..', avatar))

            User.findByIdAndDelete(req.params.id, (err) => {
                  if (err) {
                        req.flash('error', 'User not deleted, something went wrong')
                        return res.redirect('/admin/tables');
                  }
                  req.flash('success', 'Record deleted successfully')
                  return res.redirect('/admin/tables')
            })
      } catch (err) {
            req.flash('error', 'something went wrong')
            return res.redirect('/admin/tables');
      }
}

export const updateRecord = async (req, res) => {
      try {
            var singleRecord = await User.findById(req.params.id)
            res.render('update_record', { singleRecord: singleRecord })
      } catch (err) {
            req.flash('error', 'something went wrong')
            return res.redirect('/admin/tables');
      }
}
export const changeRecord = (req, res) => {
      User.uploadedAvatar(req, res, async (err) => {
            if (err) {
                  req.flash('error', 'Something went wrong');
                  return res.redirect('/admin/tables');
            }

            if (req.file) {

                  var id = req.body.record_id;
                  var oldRecord = await User.findById(id)
                  var name = req.body.fname.trim() + ' ' + req.body.lname.trim()
                  var trimmedMessage = req.body.message.trim()

                  var avatar = oldRecord.avatar;
                  fs.unlinkSync(path.join(__dirname, '..', avatar))

                  var newAvatarName = User.avatarPath + '/' + req.file.filename
                  try {
                        await User.findByIdAndUpdate(id, {
                              name: name,
                              email: req.body.email,
                              gender: req.body.gender,
                              hobby: req.body.hobby,
                              city: req.body.city,
                              message: trimmedMessage,
                              avatar: newAvatarName
                        })
                        req.flash('success', 'Record Updated Successfully')
                        res.status(200).redirect('/admin/tables')

                  } catch (err) {
                        req.flash('error', 'failed to update record')
                        return res.redirect('/admin/tables');
                  }

            }
            else {
                  try {
                        var id = req.body.record_id
                        var oldRecord = await User.findById(id)
                        var name = req.body.fname.trim() + ' ' + req.body.lname.trim()
                        var trimmedMessage = req.body.message.trim()
                        try {
                              await User.findByIdAndUpdate(id, {
                                    name: name,
                                    email: req.body.email,
                                    gender: req.body.gender,
                                    hobby: req.body.hobby,
                                    city: req.body.city,
                                    message: trimmedMessage,
                              })
                              req.flash('success', 'Successfully updated')
                              res.redirect('/admin/tables')

                        } catch (err) {
                              req.flash('error', err.message || 'failed to update data');
                              return res.redirect('/admin/tables')
                        }


                  } catch (err) {
                        req.flash('error', err.message)
                        return res.redirect('/admin/tables')
                  }
            }
      })
}
export const registerAdmin = async (req, res) => {
      try {
            if (req.body.password != req.body.cpassword) {
                  req.flash('error', 'Passwords are not matched')
                  return res.redirec('/admin/register');
            }
            const userCount = await Admin.find({ username: req.body.username });
            if (userCount != '') {
                  req.flash('error', 'User is already registered')
                  return res.redirec('/admin/register');
            }
            const emailCount = await Admin.find({ email: req.body.email });
            if (emailCount != '') {
                  req.flash('error', 'Email is already registered')
                  return res.redirec('/admin/register');
            }


            await Admin.create({
                  username: req.body.username,
                  email: req.body.email,
                  password: req.body.password
            })
            req.flash('success', 'User created successfully');
            res.redirect('/admin/login')
      } catch (err) {
            req.flash('error', err.message)
            return res.redirect('/admin/register')
      }
}

export const checkLogin = (req, res) => {
      req.flash('success', 'Login Successfully')
      return res.redirect('/admin');
}

export const logoutUser = (req, res) => {
      req.logout((err) => {
            if (err) {
                  req.flash('error', err.message)
                  return res.redirect('/admin');
            }
            req.flash('success', 'Logout successfully')
            return res.redirect('/admin/login');
      });
}

export const adminProfile = (req, res) => {
      return res.render('adminProfile')
}

export const updateAdminProfile = async (req, res) => {
      // res.send(req.body)
      try {
            const admin = await Admin.findById(req.body.adminId);
            if (admin.username == req.body.username && admin.email == req.body.email) {
                  req.flash('error', 'No changes found')
                  return res.redirect('/admin/adminProfile')
            }
            await Admin.findByIdAndUpdate(req.body.adminId, {
                  username: req.body.username,
                  email: req.body.email,
            })
            req.flash('success', 'Successfully updated')
            return res.redirect('/admin/adminProfile');
      } catch (err) {
            req.flash('error', err.message);
            return register.redirect('/admin')
      }
}


export const adminPassword = (req, res) => {
      res.render('adminPassword');
}

export const updateAdminPassword = async (req, res) => {
      // res.send(req.body)
      var adminId = req.body.adminId;
      var currentPassword = req.body.currentPassword;
      var newPassword = req.body.newPassword;
      var cpassword = req.body.cpassword;

      try {
            var admin = await Admin.findById(adminId);
            if (admin.password == currentPassword) {
                  if (currentPassword != newPassword) {
                        if (newPassword == cpassword) {
                              await Admin.findByIdAndUpdate(adminId, {
                                    password: newPassword,
                              })
                              req.logout((err) => {
                                    if (err) {
                                          req.flash('error', err.message)
                                          return res.redirect('/admin');
                                    }
                                    req.flash('success', 'Password updated successfully ! Login with new Password');
                                    return res.redirect('/admin/login');
                              })

                        }
                        else {
                              req.flash('error', 'Passwords are not the same');
                              return res.redirect('/admin')
                        }
                  }
                  else {
                        req.flash('error', 'New password is same as current password');
                        return res.redirect('/admin');
                  }
            }
            else {
                  req.flash('error', 'Incorrect Password');
                  return res.redirect('/admin')
            }
      } catch (err) {
            req.flash('error', err.message);
            return res.redirect('/admin')
      }
}

export const recoverPassword = (req, res) => {
      console.log(req.body.email);
}