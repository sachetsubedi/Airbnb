import { Request, Response } from "express";
import { join } from "path";
import { HandleError } from "../../errors/errorHandler";
import { prisma } from "../../services/prisma.service";

export const getListings = async (req: Request, res: Response) => {
	try {
		const listings = await prisma.listing.findMany({});

		res.status(200).send({
			status: "success",
			data: listings,
			message: "Listings retrieved successfully",
		});
	} catch (err) {
		HandleError(res, 500, err);
	}
};

export const addListing = async (req: Request, res: Response) => {
	try {
		const data = req.body;
		const newListing = await prisma.listing.create({
			data: data,
		});

		return res.status(201).send({
			status: "success",
			data: newListing,
			message: "Listing created successfully",
		});
	} catch (err) {
		console.log(err);
		return HandleError(res, 500, err);
	}
};

export const addListingPhotos = async (req: Request, res: Response) => {
	const photos: any = req.files?.photo;
	const listingId = req.body.listing_id;

	photos.forEach((photo: any) => {
		const fileName = `${listingId}_${photo.name}`;
		const filePath = join(
			__dirname,
			"..",
			"..",
			"..",
			"uploads",
			"listings",

			fileName
		);

		photo.mv(filePath, (err: any) => {
			if (err) {
				console.log(err);
			}
		});
	});
};
