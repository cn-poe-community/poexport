import { dialog } from 'electron';

export async function handleOpenFolder(): Promise<string | undefined> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
    });
    if (canceled) {
        return;
    } else {
        return filePaths[0];
    }
}