import userModel from "../models/userModel.js";
import donationModel from "../models/donationModel.js";
import { sendMail } from '../utils/mailer.js';

const createDonation = async (req, res) => {

    const { ngoId, userName, userEmail , userPhoneNumber , itemName, description, userAddress } = req.body;

    const userId = req.user._id;
    
    try {

        console.log(req.file);


        // V1
        //const pdfUrl = req.file ? req.file.path : undefined;


        //  const pdfUrl = req.file
        //     ? (req.file.path || req.file.secure_url || req.file.url)
        //     : undefined;

        const imageFiles = req.files || [];

        if (imageFiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image.",
            })
        }

        const imageUrls = imageFiles.map(file => file.path || file.secure_url || file.url);

        // Validate NGO configuration and accepted items
        const ngo = await userModel.findById(ngoId).select('isConfigured acceptedItems name');
        if (!ngo) {
            return res.status(400).json({ success: false, message: 'NGO not found' });
        }
        if (!ngo.isConfigured) {
            return res.status(400).json({ success: false, message: 'NGO is not accepting donations yet' });
        }
        if (!ngo.acceptedItems || !ngo.acceptedItems.includes(itemName)) {
            return res.status(400).json({ success: false, message: 'Item not accepted by this NGO' });
        }

        const donation = await donationModel.create({
            userId,
            ngoId,
            userName,
            userEmail,
            userPhoneNumber,
            itemName,
            description,
            userAddress,
            images: imageUrls,
        });

        res.status(201).json({
            success: true,
            message: "Donation created successfully",
            donation,
        });

    } catch (error) {

        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

const updateStatus = async (req, res) => {
    const { id } = req.params; // Donation ID
    const { status } = req.body; // approved or rejected

    try {
        // Load donation and donor info
        const donation = await donationModel
            .findById(id)
            .populate('userId', 'name email');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found',
            });
        }

        // Update status
        donation.status = status;
        await donation.save();

        // Prepare email content
        let subject = '';
        let html = '';
        if (status === 'approved') {
            subject = '🎉 Your Donation Has Been Approved!';
            html = `
                <h2>Hi ${donation.userId.name},</h2>
                <p>Your donation request for <strong>${donation.itemName}</strong> has been <b style="color:green;">approved</b> by the NGO.</p>
                <p>We appreciate your generosity. The NGO team will contact you soon for pickup.</p>
                <p>Thank you for supporting the cause ❤️</p>
            `;
        } else if (status === 'rejected') {
            subject = '🚫 Your Donation Request Was Rejected';
            html = `
                <h2>Hi ${donation.userId.name},</h2>
                <p>We regret to inform you that your donation request for <strong>${donation.itemName}</strong> has been <b style="color:red;">rejected</b> by the NGO.</p>
                <p>You can check details in your dashboard and try again later.</p>
                <p>Thank you for your willingness to help.</p>
            `;
        }
        await sendMail(donation.userId.email, subject, html);
        // // Send email notification (dynamic import keeps changes local)
        // try {
        //     const nodemailer = (await import('nodemailer')).default;
        //     const transporter = nodemailer.createTransport({
        //         host: process.env.SMTP_HOST,
        //         port: Number(process.env.SMTP_PORT) || 587,
        //         secure: Boolean(process.env.SMTP_SECURE) || false, // true for 465, false for others
        //         auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        //             user: process.env.SMTP_USER,
        //             pass: process.env.SMTP_PASS,
        //         } : undefined,
        //     });

        //     if (subject && html && donation.userId?.email) {
        //         await transporter.sendMail({
        //             from: process.env.FROM_EMAIL || 'no-reply@givehope.local',
        //             to: donation.userId.email,
        //             subject,
        //             html,
        //         });
        //     }
        // } catch (mailErr) {
        //     console.error('Email send failed:', mailErr?.message || mailErr);
        //     // Continue without failing the API
        // }

        return res.status(200).json({
            success: true,
            message: 'Status updated and email processed',
            donation,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ success: false, message: error.message });
    }
};

const getUserDonations = async (req, res) => {

    try {

        // You will get donationId,useId,ngoId,ngoName,ngo Logo Url
        const donations = await donationModel
            .find({ userId: req.params.userId })
            .populate('ngoId', 'name logoUrl'); // fetch the corresponding User document where _id = ngoId

        //  This replaces ngoId in each donation document with the NGO document that has name and logoUrl.
        //   So in the frontend, donation.ngoName does not exist.
        //   You need to access donation.ngoId.name instead.
        //   <CardDescription>Donated To: {donation.ngoId?.name}</CardDescription>

        // populate replaces ObjectId with the actual document data- {name , logoUrl}
        // Go to the User collection, find the document whose _id matches this ngoId, 
        // and replace the ObjectId with that document

        //         ngoId stores an ObjectId (e.g., "64f8a1c2...").

        // ref: 'User' tells Mongoose that this ID references the User collection.

        // When you call .populate('ngoId'), Mongoose does this internally:

        // Looks at the ref ('User') → knows which collection to query.

        // Finds the document in User where _id = ngoId.

        // Replaces the ngoId field in the donation document with the actual User document.

        res.status(200).json({
            success: true,
            donations, // Array of donation object done by particular use
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};

const getNGODonations = async (req, res) => {

    try {

        const donations = await donationModel
            .find({ ngoId: req.params.ngoId })
            .populate('userId', 'name email phoneNumber');

        res.status(200).json({
            success: true,
            donations // Array of donations Object
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};

export { createDonation, updateStatus, getUserDonations, getNGODonations }
