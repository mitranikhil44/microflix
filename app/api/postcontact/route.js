// postContact.js
import connectToDatabase from '@/lib/mongodb';
import { Contact } from '@/models/contactSchema';

export async function POST(request) {
    try {
        await connectToDatabase();
        let req = await request.json();
            const newContact = new Contact({
                name: req.name,
                email: req.email,
                message: req.message, 
            });

            await newContact.save();
            return Response.json({ Success: 'Thank You' }, {status: 201});

    } catch (error) {
        console.error('Error:', error.message);
        return Response.json({ Error: 'Internal Server Error' }, {status: 500});
    }
}
