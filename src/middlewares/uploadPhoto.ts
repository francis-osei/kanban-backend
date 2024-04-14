import upload from '../configs/multerConfig';

export const photo = upload.single('photo');
