const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// POST /create -> crear tarea
router.post("/create", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).send({ message: "El campo 'title' es obligatorio" });
    }

    const task = await Task.create({ title: title.trim() });
    return res.status(201).send(task);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error creando la tarea" });
  }
});

// GET / -> traer todas las tareas
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error obteniendo las tareas" });
  }
});

// GET /id/:_id -> buscar tarea por id
router.get("/id/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send({ message: "Tarea no encontrada" });
    }

    return res.status(200).send(task);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "ID inválido o error buscando la tarea" });
  }
});

// PUT /markAsCompleted/:_id -> marcar como completada
router.put("/markAsCompleted/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const task = await Task.findByIdAndUpdate(
      _id,
      { completed: true },
      { new: true }
    );

    if (!task) {
      return res.status(404).send({ message: "Tarea no encontrada" });
    }

    return res.status(200).send(task);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "ID inválido o error actualizando la tarea" });
  }
});

// PUT /id/:_id -> actualizar SOLO el título (no permitir completed aquí)
router.put("/id/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { title, completed } = req.body;

    // Bloquea cambios del campo completed desde este endpoint
    if (typeof completed !== "undefined") {
      return res.status(400).send({
        message:
          "No puedes modificar 'completed' desde este endpoint. Usa /markAsCompleted/:_id",
      });
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).send({ message: "El campo 'title' es obligatorio" });
    }

    const task = await Task.findByIdAndUpdate(
      _id,
      { title: title.trim() },
      { new: true }
    );

    if (!task) {
      return res.status(404).send({ message: "Tarea no encontrada" });
    }

    return res.status(200).send(task);
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "ID inválido o error actualizando la tarea" });
  }
});

// DELETE /id/:_id -> eliminar tarea
router.delete("/id/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const task = await Task.findByIdAndDelete(_id);

    if (!task) {
      return res.status(404).send({ message: "Tarea no encontrada" });
    }

    return res.status(200).send({ message: "Tarea eliminada", task });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: "ID inválido o error eliminando la tarea" });
  }
});

module.exports = router;
