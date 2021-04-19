import avatar from '../../assets/avatars'
import arrows from '../../assets/arrow'
import './avatar.css'
import { Fragment } from "react";
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux'
import {
    setAvatar,
    setName,
    selectAvatar,
    selectUsername
} from '../../redux/userSlice'



export const Avatar = () => {
    const { t, } = useTranslation();
    const dispatch = useDispatch();
    const avatarID = useSelector(selectAvatar)
    const avatarName = useSelector(selectUsername)


    function changeAvatar(left: boolean) {
        let newAvatarID = (avatarID + ((left) ? 1 : -1) + avatar.length) % avatar.length
        dispatch(setAvatar(newAvatarID))
    }



    return (
        <Fragment>
            <div className="total-box">
                <div style={{ textAlign: 'center', fontFamily: 'arial' }}>
                    <b>{t("player")}</b>
                </div>
                <div className="avatar-box">
                    <img alt='logo' className="img-fluid avatar-arrow " src={arrows['left']} onClick={() => changeAvatar(true)} />
                    <img alt='logo' className="img-thumbnail avatar-image " src={avatar[avatarID]} />
                    <img alt='logo' className="img-fluid avatar-arrow " src={arrows['right']} onClick={() => changeAvatar(false)} />
                </div>
                <form className="form-inline avatar-input">
                    <input type="text" className={(avatarName.length > 0) ?"form-control":"form-control is-invalid"} id="userID"
                        placeholder={t("name")} onChange={(e) => { dispatch(setName(e.target.value)) }}>
                    </input>
                </form>
          
            </div>
        </Fragment>
    );
}

//<img alt='logo' className="img-fluid avatar-arrow " src={arrows['right']}/>