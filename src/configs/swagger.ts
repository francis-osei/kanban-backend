import path from 'path';
import fs from 'fs';

import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swagger = (app: Express) => {
    const spec = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../docs/docs.json'), 'utf8')
    );

    app.use(
        '/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(spec, { customSiteTitle: 'Kanban Api' })
    );
};

export default swagger;
