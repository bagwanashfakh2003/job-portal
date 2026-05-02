import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(",") || "",
        profilePhoto: null,
        resume: null
    });

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
    };

    const fileChangeHandler = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setInput(prev => ({ ...prev, [name]: files[0] }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }

        if (input.resume) {
            formData.append("resume", input.resume);
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${USER_API_END_POINT}/profile/update`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            );

            if (res?.data?.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                error.message ||
                "Update failed";

            toast.error(message);

        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent
                className="sm:max-w-[425px]"
                onInteractOutside={() => setOpen(false)}
            >
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                </DialogHeader>

                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>

                        {/* Name */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label className="text-right">Name</Label>
                            <Input
                                name="fullname"
                                value={input.fullname}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        {/* Email */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label className="text-right">Email</Label>
                            <Input
                                name="email"
                                value={input.email}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        {/* Phone */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label className="text-right">Phone</Label>
                            <Input
                                name="phoneNumber"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        {/* Bio */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label className="text-right">Bio</Label>
                            <Input
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        {/* Skills */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label className="text-right">Skills</Label>
                            <Input
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                className="col-span-3"
                            />
                        </div>

                        {/* Profile Image */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label className="text-right">Profile Image</Label>
                            <Input
                                type="file"
                                name="profilePhoto"
                                accept="image/*"
                                onChange={fileChangeHandler}
                                className="col-span-3"
                            />
                        </div>

                        {/* Resume */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label className="text-right">Resume</Label>
                            <Input
                                type="file"
                                name="resume"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="col-span-3"
                            />
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full my-4" disabled={loading}>
                            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            {loading ? "Please wait" : "Update"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;