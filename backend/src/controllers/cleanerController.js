import Cleaner from '../models/cleanerModel.js';
import Hostel from '../models/hostelModel.js';
import { createSendToken } from './authController.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import Booking from '../models/bookingModel.js';

export const cleanerSignup = catchAsync(async (req, res, next) => {
  const { name, email, phoneNumber, hostelName, password, confirmPassword } =
    req.body;

  if (password !== confirmPassword)
    return next(new AppError('Passwords do not match', 400));

  const hostel = await Hostel.findOne({
    abbreviatedName: hostelName,
  });

  if (!hostel)
    return next(
      new AppError('Could not find the hostel you were looking for', 400)
    );

  const newCleaner = await Cleaner.create({
    name,
    email,
    phoneNumber,
    hostel: hostel._id,
    password,
  });

  createSendToken(newCleaner, 201, res);
});

export const getAllBookings = catchAsync(async (req, res, next) => {
  const cleaner = await Cleaner.findById(req.params.id);
  console.log(cleaner.hostel);
  const bookings = await Booking.find({ hostel: cleaner.hostel });

  res.status(200).json({ status: 'success', bookings });
});

export const acceptBooking = catchAsync(async (req, res, next) => {
  const { bookingID } = req.query;

  const booking = await Booking.findById(bookingID);
  if (!booking)
    return next(new AppError('Could not find booking with matching ID', 400));

  if (booking.cleaner)
    return res.status(200).json({
      status: 'success',
      message: 'Booking has already been accepted',
    });

  booking.cleaner = req.params.id;
  booking.status = 'Assigned';
  await booking.save();

  res
    .status(200)
    .json({ status: 'success', message: 'Booking accepted successfully' });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ cleaner: req.params.id });
  res.status(200).json({ status: 'success,', bookings });
});

export const getMyProfile = catchAsync(async (req, res, next) => {
  const user = await Cleaner.findById(req.params.id);
  if (!user) return next(new AppError('Cleaner not found', 401));

  res.status(200).json({
    status: 'success',
    user,
  });
});
