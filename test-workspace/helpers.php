<?php

// ! This is the code for extraction
$counter = 0;

for ($i = 0; $i < 100; $i++) {
    $counter = $i;
}

echo $counter;
// ! End of code for extraction

function formatDate($date)
{
    $timestamp = strtotime($date);
    $formatted = date('d.m.Y H:i:s', $timestamp);
    return $formatted;
}

function calculateTotal($price, $quantity, $taxRate)
{
    $subtotal = $price * $quantity;
    $tax = $subtotal * ($taxRate / 100);
    $total = $subtotal + $tax;

    return $total;
}

function sanitizeInput($input)
{
    $trimmed = trim($input);
    $cleaned = strip_tags($trimmed);
    $escaped = htmlspecialchars($cleaned);

    return $escaped;
}
