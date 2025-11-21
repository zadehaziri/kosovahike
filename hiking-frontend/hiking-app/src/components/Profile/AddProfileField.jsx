import React, { useState } from 'react';
import Button from '../Shared/Button/Button';
import './addProfileField.scss';
import Modal from '../Shared/Modal/Modal';
import { Form, message, Upload } from "antd";
import InputField from '../Shared/InputField/InputField';
import SelectField from '../Shared/SelectField/SelectField';
import authService from '../../services/authService';
import { setLoggedUser } from '../../redux/users/loggedUserSlice';
import { useDispatch, useSelector } from 'react-redux';

const AddProfileField = ({ title, logo, label, type, name }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.loggedUser);
    const [userData, setUserData] = useState({...loggedUser.user, interests: (loggedUser.user.interests || []).join(", ")});

    const handleCloseModal = () => {
        setIsAdding(false);
        form.resetFields();
    };

    const handleAddField = () => {
        setIsAdding(true);
    };

    const handleInputChange = (fieldName, value) => {
        setUserData(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSaveField = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('images', selectedFile);
            authService.uploadProfilePicture(loggedUser.user._id, formData)
                .then(res => {
                    const profileImage = res.data;
                    dispatch(setLoggedUser({
                        ...loggedUser,
                        user: {
                            ...loggedUser.user,
                            profileImg: profileImage
                        }
                    }));
                    setUserData({...userData, profileImg: profileImage});
                    message.success('Profile picture uploaded successfully');
                    handleCloseModal();
                })
                .catch(error => {
                    console.error(error);
                    message.error('Failed to upload profile picture');
                });
            return;
        }

        form.validateFields().then(values => {
            const interestsArray = values.interests ? values.interests.split(",").map(interest => interest.trim()) : [];
      
            const updatedFields = {
                ...values,
                interests: interestsArray,
                socialMedia: {
                    facebook: values["socialMedia.facebook"],
                    twitter: values["socialMedia.twitter"],
                    instagram: values["socialMedia.instagram"],
                },
            };
      
            authService.updateUser(updatedFields, loggedUser.user._id)
                .then(res => {
                    const updatedUser = res.data;
                    dispatch(setLoggedUser({ ...loggedUser, user: updatedUser }));
                    setUserData(updatedUser);
                    message.success(`${label} added successfully`);
                    handleCloseModal();
                })
                .catch(error => {
                    console.error(error);
                    message.error(`Failed to add ${label}`);
                });
        });
    };

    const skillOptions = [
        { value: '', label: 'Select Skill Level' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ];

    const genderOptions = [
        { value: '', label: 'Select Gender' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
    ];

    return (
        <div className='add-profile-field'>
            <div className='field-content'>
                <h5 className='profile-field-title'>{title}</h5>
                {logo && <div className='profile-field-logo'>{logo}</div>}
                <Button
                    className="basic-btn green"
                    type="button"
                    onClick={() => handleAddField()}
                >
                    {title}
                </Button>
            </div>
            {isAdding &&
                <Modal onClose={() => handleCloseModal()}>
                    <h2 className='content-title'>{title}</h2>
                    <Form
                        form={form}
                        layout="vertical"
                        className="add-form"
                    >
                        <Form.Item
                            label={label}
                            name={name}
                        >
                            {(type === 'file') &&
                                <div className="file-upload-container">
                                    <input
                                        type='file'
                                        onChange={handleFileChange}
                                        accept='images/*'
                                    />
                                </div>
                            }
                            {(type === 'text' || type === 'number') &&
                                <InputField
                                    classname="text-input"
                                    type={type}
                                    label={label}
                                    value={userData[name]}
                                    onChange={(e) => handleInputChange(name, e.target.value)}
                                />
                            }
                            {type === 'select' &&
                                <SelectField
                                    classname="select-field"
                                    label={label}
                                    value={userData[name]}
                                    options={name === 'gender' ? genderOptions : skillOptions}
                                    onChange={(value) => handleInputChange(name, value)}
                                />
                            }
                            {type === 'textarea' &&
                                <textarea
                                    className='text-input'
                                    rows={4}
                                    placeholder={label}
                                    value={userData[name]}
                                    onChange={(e) => handleInputChange(name, e.target.value)}
                                />
                            }
                        </Form.Item>
                        <Button
                            className="basic-btn green"
                            type="button"
                            onClick={() => handleSaveField()}
                        >
                            Add {label}
                        </Button>
                    </Form>
                </Modal>
            }
        </div>
    );
};

export default AddProfileField;
