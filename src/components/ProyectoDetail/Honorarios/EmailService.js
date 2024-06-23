import emailjs from '@emailjs/browser';

export const sendEmail = async (emailParams) => {
    try {
        const result = await emailjs.send('service_orze3qe', 'template_yief1i1', emailParams, 'VBYWnQsgbxRBcGQ8N');
        console.log(result.text);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};