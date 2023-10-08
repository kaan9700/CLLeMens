import React from "react";
import {notification as antdNotification} from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    InfoCircleFilled
} from "@ant-design/icons";

// Function to display an error notification
const errorNotification = ({message, description}) => {
    antdNotification.error({
        message,
        description,
        className: "notification",
        style: {
            width: 600,
            minWidth: 320,
            maxWidth: 568,
            backgroundColor: "#fff1f0",
            border: "1px solid #ffa39e",
            margin: 0,
            boxShadow: "unset"
        },
        icon: <CloseCircleFilled style={{color: "#f5222e"}}/>
    });
};

// Function to display a warning notification
const warningNotification = ({message, description}) => {
    antdNotification.warning({
        message,
        description,
        className: "notification",
        style: {
            width: 600,
            minWidth: 320,
            maxWidth: 568,
            backgroundColor: "#fffbe6",
            border: "1px solid #ffe58f",
            margin: 0,
            boxShadow: "unset"
        },
        icon: <InfoCircleFilled style={{color: "#f9bf02"}}/>
    });
};

// Function to display a success notification
const successNotification = ({message, description}) => {
    antdNotification.success({
        message,
        description,
        className: "notification",
        style: {
            width: 600,
            minWidth: 320,
            maxWidth: 568,
            backgroundColor: "#F6FFED",
            border: "1px solid #B7EB8F",
            margin: 0,
            boxShadow: "unset"
        },
        icon: <CheckCircleFilled style={{color: "#52C51A"}}/>
    });
};

// Main function that decides which type of notification to show based on the provided type
const Notifications = (type, {message, description}) => {
    if (type === "error") {
        return errorNotification({message, description});
    }
    if (type === "warning") {
        return warningNotification({message, description});
    }
    if (type === "success") {
        return successNotification({message, description});
    }
};

export default Notifications;
