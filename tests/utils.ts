import { ChildProcess, spawn } from "child_process";

export type DevServer = ChildProcess | null;

export async function initDevServer(url: string) {
  const isDevServerRunning = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const serverRunning = await isDevServerRunning(url);

  if (!serverRunning) {
    const devServer = spawn("pnpm", ["dev"], { stdio: "inherit" });

    return await new Promise<ChildProcess>((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const serverRunning = await isDevServerRunning(url);
        if (serverRunning) {
          clearInterval(intervalId);
          resolve(devServer);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(intervalId);
        reject(new Error("Dev server did not start in time"));
      }, 30000);
    });
  }

  return null;
}
