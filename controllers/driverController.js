const express = require('express');
const bcrypt = require('bcryptjs');
const Driver = require('../models/driver');


exports.getProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id).select('-passwordHash');
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
}



exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-passwordHash'); // исключаем хеш пароля
    res.status(200).json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};


exports.registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone, city, experience, vehicle, licensePlate, photoUrl } = req.body;

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDriver = new Driver({
      name,
      email,
      passwordHash: hashedPassword,
      phone,
      city,
      experience,
      vehicle,
      licensePlate,
      photoUrl
    });

    await newDriver.save();
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
}


exports.updateProfile = async (req, res) => {
  try {
    let driverId;

    if (req.user.role === 'driver') {
      driverId = req.user.id;  // обновляет сам себя
    } else if (req.user.role === 'admin') {
      driverId = req.body.id;  // админ указывает, кого обновлять
      if (!driverId) {
        return res.status(400).json({ message: 'ID водителя обязателен для администратора' });
      }
    } else {
      return res.status(403).json({ message: 'Нет доступа' });
    }

    const updates = { ...req.body };
    delete updates.passwordHash;
    delete updates.id; // не даём менять id

    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedDriver) {
      return res.status(404).json({ message: 'Chauffeur non trouvé' });
    }

    res.json({ message: 'Profil mis à jour', driver: updatedDriver });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};



exports.changePassword = async (req, res) => {
  try {
    const driverId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Ancien et nouveau mot de passe requis' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Chauffeur non trouvé' });
    }

    const isMatch = await bcrypt.compare(oldPassword, driver.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    driver.passwordHash = hashedNewPassword;
    await driver.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

exports.adminChangePassword = async (req, res) => {
  try {
    const { driverId, newPassword } = req.body;

    if (!driverId || !newPassword) {
      return res.status(400).json({ message: 'ID du chauffeur et nouveau mot de passe requis' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Chauffeur non trouvé' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    driver.passwordHash = hashedPassword;
    await driver.save();

    res.json({ message: 'Mot de passe changé avec succès par l\'admin' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};


exports.deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const deletedDriver = await Driver.findByIdAndDelete(driverId);
    if (!deletedDriver) {
      return res.status(404).json({ message: 'Chauffeur non trouvé' });
    }
    res.json({ message: 'Chauffeur supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

