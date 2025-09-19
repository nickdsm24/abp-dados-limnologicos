import { Request, Response, NextFunction } from "express";
import { getSensorById } from "../../models/sima/sensorModel";

export const fetchSensorById = async (req: Request, res: Response, next: NextFunction) => {
  const idSensor = parseInt(req.params.id);

  if (isNaN(idSensor)) {
    return res.status(400).json({ success: false, error: "ID inválido" });
  }

  try {
    const sensor = await getSensorById(idSensor);

    if (!sensor) {
      return res.status(404).json({ success: false, error: "Sensor não encontrado" });
    }

    return res.status(200).json({ success: true, data: sensor });
  } catch (error) {
    next(error); // delega para o middleware de erro
  }
};
