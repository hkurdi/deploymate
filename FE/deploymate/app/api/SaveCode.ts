import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { code } = req.body;

        const filePath = path.join(process.cwd(), 'BE/input_with_code.txt');
        fs.writeFile(filePath, code, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to write file' });
            }
            res.status(200).json({ message: 'File written successfully' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}




