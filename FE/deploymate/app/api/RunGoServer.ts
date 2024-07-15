import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const goFilePath = path.join(process.cwd(), 'BE', 'main.go');
        exec(`go run ${goFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ error: 'Failed to run Go server' });
            }

            const filePath = path.join(process.cwd(), 'BE', 'requirements.txt');
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`readFile error: ${err}`);
                    return res.status(500).json({ error: 'Failed to read output file' });
                }

                res.status(200).json({ message: data });
            });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
