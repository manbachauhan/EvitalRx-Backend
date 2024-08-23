import jwt  from 'jsonwebtoken'

export const generateTokenAndSetCookies=(res,userId)=>{
    const token = jwt.sign({ id:userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:3600000
    });

    return  token;
}