<?php

class ProductController
{
    public function create($data)
    {
        // Validate input data
        if (empty($data['name']) || empty($data['price'])) {
            return ['error' => 'Invalid data'];
        }

        // Check if product exists
        $existing = $this->findByName($data['name']);
        if ($existing) {
            return ['error' => 'Product already exists'];
        }

        // ! This is the code for extraction
        $counter = 0;

        for ($i = 0; $i < 100; $i++) {
            $counter = $i;
        }

        echo $counter;
        // ! End of code for extraction

        // Create product
        $product = [
            'name' => $data['name'],
            'price' => $data['price'],
            'created_at' => date('Y-m-d H:i:s')
        ];

        $this->save($product);

        return ['success' => true, 'product' => $product];
    }

    private function findByName($name)
    {
        // Find product in database
        return null;
    }

    private function save($product)
    {
        // Save product to database
    }
}
