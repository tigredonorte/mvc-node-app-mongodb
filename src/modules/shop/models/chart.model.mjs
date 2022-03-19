import fs from 'fs/promises';

const fileName = 'data/chart.json';

export class ChartModel {

    async list() {
        const readed = await fs.readFile(fileName);
        return JSON.parse(Buffer.concat([readed]).toString());
    }

    async add(chart) {
        const charts = await this.list();
        charts.push({
            id: `${Math.random() * 100000}`
        });
        await fs.writeFile(fileName, JSON.stringify(charts), 'utf-8');
    }

    async get(id) {
        const charts = await this.list();
        return charts.find(chart => chart.id === id);
    }
    
    async edit(id, chart) {
        const charts = await this.list();
        const index = charts.findIndex(chart => chart.id === id);
        if (index === -1) {
            return false;
        }
        charts[index] = { ...chart, id };
        await fs.writeFile(fileName, JSON.stringify(charts), 'utf-8');
        return true;
    }

    async delete(id) {
        let charts = await this.list();
        charts = charts.filter(chart => chart.id !== id);
        await fs.writeFile(fileName, JSON.stringify(charts), 'utf-8');
    }
}
