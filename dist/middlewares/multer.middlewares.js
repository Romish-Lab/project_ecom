"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUploader = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const multerUploader = () => {
    const uploadFolder = path_1.default.join(process.cwd(), "uploads");
    const filesize = 10 * 1024 * 1024;
    //* create uploads folder
    if (!fs_1.default.existsSync(uploadFolder)) {
        fs_1.default.mkdirSync(uploadFolder, {
            recursive: true,
        });
    }
    //* multer storage
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadFolder);
        },
        filename: function (req, file, cb) {
            const uniqueName = Date.now() + "-" + file.originalname;
            cb(null, uniqueName);
        },
    });
    //* file filter
    const fileFilter = (req, file, cb) => {
        const allowedExtensions = /png|jpg|jpeg|webp|pdf/;
        const allowedMimeType = [
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/webp",
            "application/pdf",
        ];
        const extName = allowedExtensions.test(path_1.default.extname(file.originalname).toLowerCase());
        const isAllowedMimeType = allowedMimeType.includes(file.mimetype);
        if (extName && isAllowedMimeType) {
            cb(null, true);
        }
        else {
            const error = new appError_utils_1.default("Only image (png,jpg,jpeg,webp) and pdf are allowed", 400);
            cb(error);
        }
    };
    //*  multerupload API
    const upload = (0, multer_1.default)({
        storage,
        fileFilter,
        limits: {
            fileSize: filesize,
        },
    });
    return upload;
};
exports.multerUploader = multerUploader;
