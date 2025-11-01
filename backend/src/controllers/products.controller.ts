import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export const productsController = {
  async getHealthierAlternatives(req: Request, res: Response) {
    try {
      const minScore = Number(req.query.minScore || 50);

      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .gt("health_score", minScore)
        .order("health_score", { ascending: false })
        .limit(10);

      if (error) throw error;

      return res.status(200).json({ alternatives: data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Unable to fetch alternatives" });
    }
  },
};
