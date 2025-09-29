export enum AuthMessage {
    AlreadyExistAccount = "کاربر وجود دارد",
    AlreadyExistEmail = "ایمیل وجود دارد",
    AlreadyExistUsername = "نام کاربری وجود دارد",
    RequiredData = "ایمیل و رمزعبور الزامی است",
    InvalidData = "ایمیل یا رمزعبور اشتباه است",
    NotFoundAccount = "کاربر یافت نشد",
    LoginRequired = "وارد حساب کاربری خود شوید",
    NotAccess = "شما دسترسی ندارید",
    Banned = "شما بن شده اید",
}

export enum SuccessMessage {
    Register = "ثبت نام شما موفقیت آمیز بود",
    Login = "شما با موفقیت وارد حساب کاربری خود شدید",
    UpdateProfile = "پروفایل با موفقیت به روز شد",
}

export enum NotFoundMessage {
    Genre = "ژانر یافت نشد",
    Artist = "خواننده یافت نشد",
    User = "کاربر یافت نشد",
    Song = "آهنگ یافت نشد",
    Playlist = "پلی لیست یافت نشد",
    SongPlaylist = "آهنگ در پلی لیست وجود ندارد",
}

export enum PublicMessage {
    Followed = "با موفقیت دنبال شد",
    UnFollow = "از لیست دنبال شوندگان حذف شد",
    CantFollow = "نمی توانید دنبال کنید",
    Liked = "آهنگ با موفقیت لایک شد",
    DisLike = "لایک شما از آهنگ برداشته شد",
    PlaylistLiked = "پلی لیست با موفقیت لایک شد",
    PlaylistDisLike = "پلی لیست آنلایک شد",
}

export enum AdminMessage {
    Ban = "بن شد",
    Unban = "از لیست بن خارج شد",
}
